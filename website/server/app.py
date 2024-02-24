from datetime import datetime
from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from config import ApplicationConfig
from flask_cors import CORS
from models import Prop_Type, Region, db, User, Organization
import requests
import cloudinary
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_mail import Mail, Message
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
import numpy as np

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
mail = Mail(app)
s = URLSafeTimedSerializer(ApplicationConfig.SECRET_KEY)
X = ApplicationConfig.FEATURES
y = ApplicationConfig.LABEL

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    email = request.json.get('email')
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Email address not found"}), 400

    token = s.dumps(email, salt='password-reset-salt')

    msg = Message('Password Reset Request', sender=ApplicationConfig.MAIL_USERNAME, recipients=[email])
    link = f'http://localhost:3000/reset-password/{token}'
    msg.body = f'Your link to reset your password is {link}'
    mail.send(msg)

    return jsonify({"message": "Password reset email has been sent."}), 200

@app.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    if request.method == 'GET':
        return jsonify({"message": "Password reset link is valid"}), 200
    
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=660)  # Token expires after 10 mins
    except SignatureExpired:
        return jsonify({"message": "The password reset link is expired"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Invalid token"}), 400

    new_password = request.json.get('password')
    user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    db.session.commit()

    return jsonify({"message": "Your password has been updated."}), 200


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

@app.route('/get-types', methods=['GET'])
def get_prop_type():
    types = Prop_Type.query.all()

    return jsonify({
        "data": [
            {
                "id": prop_type.id,
                "name": prop_type.name
            } for prop_type in types
        ]
    }), 200

@app.route('/get-regions', methods=['GET'])
def get_regions():
    regions = Region.query.all()

    return jsonify({
        "data": [
            {
                "id": region.id,
                "name": region.name
            } for region in regions
        ]
    }), 200

def round_to_nearest(number: int) -> int:
    quotient = number / 100000
    rounded_quotient = round(quotient)
    rounded_number = rounded_quotient * 100000

    return rounded_number

def process_data(data_dict: dict) -> list:
    processed_data = []

    size = float(data_dict["size"])
    bedrooms = int(data_dict["bedrooms"]) if int(data_dict["bedrooms"]) != 0 else 1
    bathrooms = int(data_dict["bedrooms"]) if int(data_dict["bedrooms"]) != 0 else 1

    processed_data.append(bedrooms)
    processed_data.append(bathrooms)
    processed_data.append(size)

    for column in X.columns:
        if column.startswith("region_"):
            region = "region_" + data_dict["region"]
            processed_data.append(1 if column == region else 0)
        elif column.startswith("type_"):
            prop_type = "type_" + data_dict["propType"]
            processed_data.append(1 if column == prop_type else 0)

    return processed_data

def make_prediction(processed_data: list) -> int:
    X_train, X_test, y_train, y_test = train_test_split(X,y,train_size=0.80, test_size=0.20, random_state=1)

    scaler = StandardScaler()
    scaler_y = MinMaxScaler()

    scaler.fit_transform(X_train)
    scaler.transform(X_test)

    y_train_array = y_train.to_numpy()
    y_test_array = y_test.to_numpy()

    scaler_y.fit_transform(y_train_array.reshape(-1, 1))
    scaler_y.transform(y_test_array.reshape(-1, 1))

    model = ApplicationConfig.MODEL

    property = np.array(processed_data).reshape(1, -1)
    predicted_class = model.predict(scaler.transform(property))
    predicted_price = scaler_y.inverse_transform(predicted_class.reshape(-1, 1))[0][0]

    return round_to_nearest(predicted_price)

@app.route('/prediction', methods=['POST'])
def post_prediction():
    
    data = request.json
    data = process_data(data)

    return jsonify({"message": "Prediction was made", "prediction": make_prediction(data)}), 200

@app.route('/login', methods=['POST'])
def login_user():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()

    consent_given = request.json.get("cookieConsent")

    # Will disable this for now (for testing purposes only)
    # If consent is not given, user will not have access to entire website
    # if not consent_given:
    #     return jsonify({"message": "Consent for cookies not given"}), 403

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