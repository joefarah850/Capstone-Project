from flask_sqlalchemy import SQLAlchemy
from time import time

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'  # This is assuming your table name is 'users'
    
    # Columns based on the provided schema
    id = db.Column(db.String(255), primary_key=True, default=db.func.uuid())
    email = db.Column(db.String(255), unique=True, nullable=False)
    gender = db.Column(db.String(1), nullable=False)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(80), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    account_creation_date = db.Column(db.DateTime, nullable=False)
    last_login = db.Column(db.DateTime, nullable=True)
    update_date = db.Column(db.DateTime, nullable=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'), nullable=False, index=True)
    profile_pic_url = db.Column(db.String(255), nullable=True)
    
    organization = db.relationship('Organization', backref='User')


class Organization(db.Model):
    __tablename__ = 'organization'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    organization = db.Column(db.String(100), nullable=False, default="Individual")

    users = db.relationship('User', backref='Organization', lazy=True)