from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy  # type: ignore

# Inicializa Flask y configura la base de datos
app = Flask(__name__, static_folder='frontend/build')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///citas.db'  # Configuración para usar SQLite
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Deshabilita el seguimiento de modificaciones
app.config['TABLES_CREATED'] = False  # Añade esta línea para usar la configuración de la aplicación
CORS(app)  # Esto habilita CORS para que las solicitudes entre el frontend y el backend no tengan problemas de dominio cruzado

# Inicializa SQLAlchemy
db = SQLAlchemy(app)

# Modelo para las citas
from typing import Optional

class Cita(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    hour = db.Column(db.String(5), nullable=False)
    reason = db.Column(db.String(200))

    def __repr__(self) -> str:
        return f"<Cita {self.name}, {self.date}, {self.hour}>"

# Ruta para servir los archivos estáticos (frontend)
@app.route('/')
def serve():
    if app.static_folder:
        return send_from_directory(app.static_folder, 'index.html')
    else:
        abort(404, description="Static folder not configured")

# Ruta para manejar la subida de archivos (si es necesario)
@app.route('/uploads/<path:filename>')
def download_file(filename):
    upload_folder = app.config.get('UPLOAD_FOLDER')
    if not upload_folder:
        abort(404, description="Upload folder not configured")
    return send_from_directory(upload_folder, filename, as_attachment=True)

# Ruta para manejar la creación de citas (API) - Soporte tanto para GET como POST
@app.route('/api/citas', methods=['GET', 'POST'])  # type: ignore
def manejar_citas():
    if request.method == 'POST':
        try:
            data = request.get_json()  # Recoge los datos enviados desde el frontend
            print("Datos recibidos:", data)  # Esto se imprimirá en la consola del backend

            name = data.get('name')
            date = data.get('date')
            hour = data.get('hour')
            reason = data.get('reason')

            # Validar los datos
            if not all([name, date, hour]):
                return jsonify({"error": "Faltan datos requeridos"}), 400

            # Crear una nueva cita en la base de datos
            new_cita = Cita(name=name, date=date, hour=hour, reason=reason)
            db.session.add(new_cita)
            db.session.commit()

            return jsonify({"message": "Cita agendada correctamente", "data": data}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    elif request.method == 'GET':
        # Obtener todas las citas desde la base de datos
        citas = Cita.query.all()
        citas_data = [{"name": cita.name, "date": cita.date, "hour": cita.hour, "reason": cita.reason} for cita in citas]
        return jsonify(citas_data), 200

# Inicia la base de datos con el contexto de aplicación
@app.before_request
def create_tables():
    if not app.config['TABLES_CREATED']:
        with app.app_context():
            db.create_all()
            app.config['TABLES_CREATED'] = True

# Inicia el servidor de Flask
if __name__ == '__main__':
    app.run(debug=True, port=5000)