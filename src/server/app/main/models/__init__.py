from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .UsersModel import UsersModel
from .VerificationModel import VerificationModel