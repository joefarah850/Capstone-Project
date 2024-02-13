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


