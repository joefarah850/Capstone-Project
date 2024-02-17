import base64
from datetime import datetime
from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from config import ApplicationConfig
from flask_cors import CORS
from models import db, User, Organization
import requests
import cloudinary

cloudinary.config( 
  cloud_name = ApplicationConfig.CLOUDINARY_CLOUD_NAME,
  api_key = ApplicationConfig.CLOUDINARY_API_KEY, 
  api_secret = ApplicationConfig.CLOUDINARY_API_SECRET,
  secure=True
)

import cloudinary.uploader

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
CORS(app, supports_credentials=True)

bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/@me', methods=['GET'])
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"message": "User not logged in"}), 401
    
    user = User.query.filter_by(id=user_id).first()

    return jsonify({
        "message": "User retrieved successfully",
        "data": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "profile_pic": user.profile_pic_url
        }
    }), 200

@app.route('/register', methods=['POST'])
def register_user():
    email = request.json.get("email")
    password = request.json.get("password")
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    gender = request.json.get("gender")
    date_of_birth = request.json.get("dateOfBirth")
    account_creation_date = datetime.now()
    organization_id = request.json.get("organization_id")
    profile_pic_url = request.json.get("profilePic")

    recaptcha_response = request.json.get("reCaptcha")
    secret_key = ApplicationConfig.RECAPTCHA_SECRET_KEY
    payload = {'secret': secret_key, 'response': recaptcha_response}
    response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)
    result = response.json()

    if not result.get('success'):
        return jsonify({"message": "reCAPTCHA verification failed"}), 400

    email_exists = User.query.filter_by(email=email).first() is not None
    
    if email_exists:
        return jsonify({"message": "Email already exists"}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        password=hashed_password,
        email=email,
        first_name=first_name,
        last_name=last_name,
        gender=gender,
        date_of_birth=date_of_birth,
        account_creation_date=account_creation_date,
        organization_id=organization_id,
    )

    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    if "data:image" in profile_pic_url:
        upload = cloudinary.uploader.upload(profile_pic_url, public_id=f"{new_user.id}_profile_pic", folder="profile_pics", overwrite=True, resource_type="image")

        profile_pic = upload.get("url")

        new_user.profile_pic_url = profile_pic
        db.session.commit()
    else:
        profile_pic = "../images/noprofilepic.png"

        new_user.profile_pic_url = profile_pic
        db.session.commit()

    return jsonify({
        "message": "User created successfully",
        "data": {
            "id": new_user.id,
            "email": new_user.email,
            "first_name": new_user.first_name,
            "last_name": new_user.last_name,
            "gender": new_user.gender,
            "date_of_birth": new_user.date_of_birth,
            "account_creation_date": new_user.account_creation_date,
            # "organization_id": new_user.organization_id
        }
    }), 201

# @app.route('/organizations', methods=['GET'])
# def get_organizations():
#     organizations = Organization.query.all()

#     return jsonify({
#         "data": [
#             {
#                 "id": organization.id,
#                 "name": organization.organization
#             } for organization in organizations
#         ]
#     }), 200

@app.route('/login', methods=['POST'])
def login_user():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()

    consent_given = request.json.get("cookieConsent")

    if not consent_given:
        return jsonify({"message": "Consent for cookies not given"}), 403

    if user is None:
        return jsonify({"message": "User does not exist"}), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Incorrect password"}), 401
    
    user.last_login = datetime.now()
    db.session.commit()

    
    session["user_id"] = user.id
    
    return jsonify({
        "message": "User logged in successfully",
        "data": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "profile_pic": user.profile_pic_url
        }
    }), 200

@app.route('/logout', methods=['POST'])
def logout_user():
    session.pop("user_id", None)

    return jsonify({"message": "User logged out successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)