from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Cargar variables de entorno según el entorno (desarrollo o producción)
environment = os.getenv("FLASK_ENV", "development")
if environment == "production":
    load_dotenv(".env.production")
else:
    load_dotenv(".env")

# Inicializa Flask
app = Flask(__name__, static_folder="frontend/build", static_url_path="")
CORS(app)

# Configuración de MongoDB
mongo_url = os.getenv("DATABASE_URL")
db_name = os.getenv("MONGO_DB_NAME", "sistema_citas")  # Valor predeterminado

# Validar configuración de MongoDB
if not mongo_url:
    raise ValueError("DATABASE_URL no está configurada en el archivo .env.")
if not db_name or not isinstance(db_name, str):
    raise ValueError("MONGO_DB_NAME no está configurado correctamente en el archivo .env.")

# Inicializar cliente de MongoDB
try:
    client = MongoClient(mongo_url)
    db = client[db_name]
    print(f"Conectado a la base de datos: {db_name}")
except Exception as e:
    print(f"Error al conectar con MongoDB: {str(e)}")
    raise e


@app.route("/")
def serve():
    """
    Sirve la aplicación React desde la carpeta estática 'frontend/build'.
    """
    if app.static_folder:
        return send_from_directory(app.static_folder, "index.html")
    else:
        abort(404, description="Static folder not configured")


@app.route("/api/citas", methods=["GET", "POST"])
def manejar_citas():
    """
    Maneja las citas de la API:
    - GET: Lista todas las citas de la base de datos.
    - POST: Crea una nueva cita con los datos proporcionados.
    """
    if request.method == "POST":
        try:
            # Recoger datos enviados desde el frontend
            data = request.get_json()
            name = data.get("name")
            date = data.get("date")
            time = data.get("time")
            reason = data.get("reason")

            # Validar datos obligatorios
            if not all([name, date, time]):
                return jsonify({"error": "Faltan datos requeridos"}), 400

            # Insertar nueva cita en la base de datos
            collection = db["citas"]
            cita_id = collection.insert_one({
                "name": name,
                "date": date,
                "time": time,
                "reason": reason,
            }).inserted_id

            return jsonify({"message": "Cita agendada correctamente", "cita_id": str(cita_id)}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif request.method == "GET":
        try:
            # Listar todas las citas
            collection = db["citas"]
            citas = list(collection.find({}, {"_id": 0}))  # Excluir el campo _id
            return jsonify(citas), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Método no permitido"}), 405


@app.errorhandler(404)
def not_found(error):
    """
    Maneja los errores de rutas no encontradas.
    """
    return jsonify({"error": "Ruta no encontrada"}), 404


if __name__ == "__main__":
    """
    Inicia la aplicación Flask en modo debug si estamos en desarrollo.
    """
    app.run(debug=(environment == "development"), port=5000)
