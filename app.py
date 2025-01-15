from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS

app = Flask(__name__, static_folder='frontend/build')
CORS(app)  # Esto habilita CORS para que las solicitudes entre el frontend y el backend no tengan problemas de dominio cruzado

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

# Ruta para manejar la creación de citas (API)
@app.route('/api/citas', methods=['POST'])
def agendar_cita():
    try:
        data = request.get_json()  # Recoge los datos enviados desde el frontend
        print("Datos recibidos:", data)  # Esto se imprimirá en la consola del backend
        
        name = data.get('name')
        date = data.get('date')
        hour = data.get('hour')
        reason = data.get('reason')

        # Aquí puedes agregar validaciones para asegurarte de que los datos no sean nulos
        if not all([name, date, hour]):
            return jsonify({"error": "Faltan datos requeridos"}), 400

        # Aquí, podrías agregar lógica para guardar la cita en una base de datos, si es necesario.
        return jsonify({"message": "Cita agendada correctamente", "data": data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Inicia el servidor de Flask
if __name__ == '__main__':
    app.run(debug=True, port=5000)
