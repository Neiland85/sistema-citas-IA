from flask import Flask, request, jsonify, send_from_directory, abort, g
from flask_cors import CORS
import sqlite3
import os

# Inicializa Flask y configura la base de datos
app = Flask(__name__, static_folder='frontend/build')
app.config['DATABASE'] = 'instance/citas.db'  # Ruta para la base de datos SQLite
CORS(app)  # Habilita CORS para solicitudes entre frontend y backend

# Asegúrate de que el directorio de la base de datos exista
if not os.path.exists('instance'):
    os.makedirs('instance')

# Función para conectar a la base de datos
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(app.config['DATABASE'])
        g.db.row_factory = sqlite3.Row
    return g.db

# Cierra la conexión a la base de datos al finalizar la solicitud
@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# Inicializa la base de datos con el esquema inicial
def init_db():
    db = get_db()
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    with open(schema_path, 'r') as f:
        db.executescript(f.read())

# Inicializa la base de datos antes de procesar cualquier solicitud
@app.before_request
def before_request():
    if not os.path.exists(app.config['DATABASE']):
        init_db()

# Ruta para servir la aplicación React desde la carpeta build
@app.route('/')
def serve():
    if app.static_folder:
        return send_from_directory(app.static_folder, 'index.html')
    else:
        abort(404, description="Static folder not configured")

# Ruta para manejar archivos subidos
@app.route('/uploads/<path:filename>')
def download_file(filename):
    upload_folder = app.config.get('UPLOAD_FOLDER')
    if not upload_folder:
        abort(404, description="Upload folder not configured")
    return send_from_directory(upload_folder, filename, as_attachment=True)

# Ruta para manejar las citas
@app.route('/api/citas', methods=['GET', 'POST'])
def manejar_citas():
    if request.method == 'POST':
        try:
            # Recoge los datos enviados desde el frontend
            data = request.get_json()
            name = data.get('name')
            date = data.get('date')
            time = data.get('time')
            reason = data.get('reason')

            # Validar los datos obligatorios
            if not all([name, date, time]):
                return jsonify({"error": "Faltan datos requeridos"}), 400

            # Insertar una nueva cita en la base de datos
            db = get_db()
            cursor = db.cursor()
            cursor.execute("INSERT INTO citas (name, date, time, reason) VALUES (?, ?, ?, ?)",
                        (name, date, time, reason))
            db.commit()

            return jsonify({"message": "Cita agendada correctamente", "data": data}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif request.method == 'GET':
        try:
            # Recuperar todas las citas de la base de datos
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT * FROM citas")
            citas = cursor.fetchall()

            citas_data = [{"name": cita['name'], "date": cita['date'], "time": cita['time'], "reason": cita['reason']} for cita in citas]
            return jsonify(citas_data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Método no permitido"}), 405

# Punto de entrada principal
if __name__ == '__main__':
    app.run(debug=True, port=5000)
