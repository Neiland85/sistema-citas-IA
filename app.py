from flask import Flask, request, jsonify
from pymongo import MongoClient
import os

app = Flask(__name__)

# Conexión a la base de datos
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise EnvironmentError("DATABASE_URL no está configurada. Verifica tu archivo .env")

try:
    client = MongoClient(DATABASE_URL)
    db = client["sistema-citas"]
    collection = db["citas"]
    print("Conexión exitosa a la base de datos")
except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")
    raise

# Ruta raíz
@app.route('/')
def home():
    return jsonify({"message": "Bienvenido al sistema de gestión de citas"}), 200

# Ruta para agendar una cita
@app.route('/api/citas', methods=['POST'])
def agendar_cita():
    try:
        data = request.get_json()
        name = data.get("name")
        date = data.get("date")
        time = data.get("time")
        reason = data.get("reason")

        # Asignar prioridad automática basada en el motivo
        if reason and "dolor de pecho" in reason.lower():
            priority = "urgente"
        elif reason and "chequeo general" in reason.lower():
            priority = "normal"
        else:
            priority = data.get("priority", "normal")  # Valor por defecto si no se especifica o no coincide

        # Validar datos obligatorios
        if not all([name, date, time]):
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        # Crear cita y almacenarla en la base de datos
        cita = {
            "name": name,
            "date": date,
            "time": time,
            "reason": reason,
            "priority": priority  # Almacena la prioridad calculada
        }
        result = collection.insert_one(cita)
        return jsonify({"message": "Cita agendada correctamente", "cita_id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para obtener todas las citas ordenadas
@app.route('/api/citas', methods=['GET'])
def obtener_citas():
    try:
        # Obtener citas ordenadas por prioridad, fecha y hora
        citas = list(collection.find({}, {"_id": 0}).sort([("priority", -1), ("date", 1), ("time", 1)]))
        return jsonify(citas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para eliminar todas las citas (opcional, para pruebas)
@app.route('/api/citas', methods=['DELETE'])
def eliminar_todas_las_citas():
    try:
        result = collection.delete_many({})
        return jsonify({"message": f"Se eliminaron {result.deleted_count} citas"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
