from pymongo import MongoClient

# Configuración de la conexión
DATABASE_URL = "mongodb+srv://Neiland85:SecurePassword123@cluster-sistema-citas-i.svhea.mongodb.net/sistema-citas?retryWrites=true&w=majority"

try:
    client = MongoClient(DATABASE_URL)
    db = client["sistema-citas"]
    print("Conexión exitosa a MongoDB.")

    # Prueba de inserción
    collection = db["citas"]
    test_data = {
        "name": "Prueba",
        "date": "2025-01-21",
        "time": "12:00",
        "reason": "Prueba de conexión"
    }
    result = collection.insert_one(test_data)
    print("Documento insertado con ID:", result.inserted_id)

except Exception as e:
    print("Error al conectar o insertar en MongoDB:", str(e))

