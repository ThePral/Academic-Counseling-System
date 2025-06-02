from sqlalchemy import Column, Integer, String, DateTime, Enum
from .database import Base
from datetime import datetime
import enum

class RoleEnum(enum.Enum):
    student = "student"
    consumer = "consumer"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    userid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone_number = Column(String, unique=True, nullable=True)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.student)
    registrationDate = Column(DateTime, default=datetime.utcnow)