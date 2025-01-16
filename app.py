from flask import Flask, request, jsonify, send_from_directory, abort, g
from flask_cors import CORS
import sqlite3
import os

# Inicializa Flask y configura la base de datos
app = Flask(__name__, static_folder='frontend/build')
app.config['DATABASE'] = 'instance/citas.db'  # Ruta para la base de datos SQLite
CORS(app)  # Esto habilita CORS para que las solicitudes entre el frontend y el backend no tengan problemas de dominio cruzado

# Asegúrate de que el directorio de la base de datos exista
if not os.path.exists('instance'):
    os.makedirs('instance')

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(app.config['DATABASE'])
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    with app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

@app.before_request
def before_request():
    init_db()

@app.route('/')
def serve():
    if app.static_folder:
        return send_from_directory(app.static_folder, 'index.html')
    else:
        abort(404, description="Static folder not configured")

@app.route('/uploads/<path:filename>')
def download_file(filename):
    upload_folder = app.config.get('UPLOAD_FOLDER')
    if not upload_folder:
        abort(404, description="Upload folder not configured")
    return send_from_directory(upload_folder, filename, as_attachment=True)

@app.route('/api/citas', methods=['GET', 'POST'])
def manejar_citas():
    if request.method == 'POST':
        try:
            data = request.get_json()  # Recoge los datos enviados desde el frontend
            print("Datos recibidos:", data)

            name = data.get('name')
            date = data.get('date')
            time = data.get('time')
            reason = data.get('reason')

            # Validar los datos
            if not all([name, date, time]):
                return jsonify({"error": "Faltan datos requeridos"}), 400

            # Crear una nueva cita en la base de datos
            db = get_db()
            cursor = db.cursor()
            cursor.execute("INSERT INTO citas (name, date, time, reason) VALUES (?, ?, ?, ?)",
                        (name, date, time, reason))
            db.commit()
            db.close()

            return jsonify({"message": "Cita agendada correctamente", "data": data}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    elif request.method == 'GET':
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM citas")
        citas = cursor.fetchall()
        db.close()
        
        citas_data = [{"name": cita['name'], "date": cita['date'], "time": cita['time'], "reason": cita['reason']} for cita in citas]
        return jsonify(citas_data), 200
    return jsonify({"error": "Método no permitido"}), 405

if __name__ == '__main__':
    app.run(debug=True, port=5000)