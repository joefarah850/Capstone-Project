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
    token_used = db.Column(db.Boolean, nullable=False, default=False)
    country = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(45), nullable=False)
    
    organization = db.relationship('Organization', backref='User')

# Organization Design to be added
class Organization(db.Model):
    __tablename__ = 'organization'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    organization = db.Column(db.String(100), nullable=False, default="Individual")
    org_url = db.Column(db.String(255), nullable=True)
    org_email = db.Column(db.String(255), nullable=False)
    

class Prop_Type(db.Model):
    __tablename__ = 'type'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)

    # properties = db.relationship('Property', backref='Prop_Type', lazy=True)

class Region(db.Model):
    __tablename__ = 'region'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)

    # properties = db.relationship('Property', backref='Region', lazy=True)

class Property(db.Model):
    __tablename__ = 'property'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    predicted_price = db.Column(db.Float, nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey('type.id'), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)
    size = db.Column(db.Numeric(precision=10, scale=2))
    num_rooms = db.Column(db.Integer, nullable=False)
    num_bathrooms = db.Column(db.Integer, nullable=False)

    prop_type = db.relationship('Prop_Type', backref='Property')
    region = db.relationship('Region', backref='Property')

class History(db.Model):
    __tablename__ = 'search_history'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    user_id = db.Column(db.String(255), db.ForeignKey('user.id'), nullable=False)
    search_datetime= db.Column(db.DateTime, nullable=False)
    deleted = db.Column(db.Boolean, nullable=False, default=False)

    user = db.relationship('User', backref='History')
    property = db.relationship('Property', backref='History')