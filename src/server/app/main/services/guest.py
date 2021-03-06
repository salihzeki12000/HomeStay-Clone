import json
import jwt
from ..models import db, UsersModel, ApartmentModel
import datetime
from instance.config import SECRET_KEY


def guest_register(info):
    try:
        firstname = info["firstname"]
        lastname = info["lastname"]
        email = info["email"]
        password = info["password"]

        if firstname == "" or lastname == "" or email == "" or password == "":
            return json.dumps({"error": True, "message": "Empty fields"})

        if type(firstname) is not str or type(lastname) is not str or type(email) is not str or type(password) is not str:
            return json.dumps({"error": True, "message": "Incorrect Datatype"})

        if "phonenumber" in info:
            phonenumber = info["phonenumber"]
        else:
            phonenumber = None

        status = UsersModel.query.filter(UsersModel.email == email).first()

        if status == None:
            user = UsersModel(firstname=firstname, lastname=lastname,
                              email=email, password=password, phonenumber=phonenumber)
            db.session.add(user)
            db.session.commit()
            return json.dumps({"error": False,
                               "message": "User registered successfully"})
        else:
            return {"error": True, "message": "Email already exists"}

    except KeyError:
        return json.dumps({"error": True,
                           "message": "One or more fields are missing!"})


def guest_login(info):
    try:
        email = info["email"]
        password = info["password"]
    except KeyError:
        return json.dumps({"error": True,
                           "message": "One or more fields are missing!"})

    if email == "" or password == "":
        return json.dumps({"error": True, "message": "Empty fields"})

    if type(email) is not str or type(password) is not str:
        return json.dumps({"error": True, "message": "Incorrect Datatype"})

    status = UsersModel.query.filter(UsersModel.email == email).first()

    if status is None:
        return json.dumps({"error": True, "message": "Email doesn't exist"})
    else:
        if status.email == email and status.password == password:
            host = ApartmentModel.query.filter(
                ApartmentModel.user_id == status.id).first()

            if host is None:
                host = False
            else:
                host = True

            data = {
                "host": host,
                "name": status.firstname,
                "email": status.email,
                "created_at": str(datetime.datetime.utcnow()),
                "expiry_at": str(datetime.datetime.utcnow() + datetime.timedelta(days=1))
            }

            encoded_data = jwt.encode(data, SECRET_KEY)

            return json.dumps({"name": status.firstname,
                               "host": host, "error": False, "message": "Logged in successfully", "token": encoded_data.decode(), "host": host})

        return json.dumps({"error": True, "message": "Incorrect Password!"})
