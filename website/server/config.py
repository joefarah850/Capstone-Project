from dotenv import load_dotenv
import os
import redis

load_dotenv()

class ApplicationConfig:
    SECRET_KEY = os.urandom(24)

    SQLAlchemy_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = f'mysql://{os.environ["DB_USER_TEST"]}:{os.environ["DB_PASSWORD_TEST"]}@{os.environ["DB_HOST_TEST"]}/{os.environ["DB_NAME_TEST"]}'

    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url("redis://localhost:6379")

    RECAPTCHA_SECRET_KEY = os.environ["RECAPTCHA_SECRET_KEY"]

    CLOUDINARY_CLOUD_NAME = os.environ["CLOUDINARY_CLOUD_NAME"]
    CLOUDINARY_API_KEY = os.environ["CLOUDINARY_API_KEY"]
    CLOUDINARY_API_SECRET = os.environ["CLOUDINARY_API_SECRET"]

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_SSL = False
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ["MAIL_USERNAME"]
    MAIL_PASSWORD = os.environ["MAIL_PASSWORD"]
    
    

