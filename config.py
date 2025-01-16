class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///citas.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your_secret_key_here'

class DevelopmentConfig(Config):
    DEBUG = True

