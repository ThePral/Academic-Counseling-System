from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Float
from .database import Base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

class RoleEnum(enum.Enum):
    student = "student"
    counselor = "counselor"
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
    
    student = relationship("Student", back_populates="user", uselist=False)
    counselor = relationship("Counselor", back_populates="user", uselist=False)

class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.userid"), nullable=False)
    major = Column(String, nullable=True) 
    academic_year = Column(String, nullable=True)  
    gpa = Column(Float, nullable=True)  

    user = relationship("User", back_populates="student")

class Counselor(Base):
    __tablename__ = "counselors"

    counselor_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.userid"), nullable=False)
    department = Column(String, nullable=True)  
    available_slots = Column(Integer, nullable=True) 

    user = relationship("User", back_populates="counselor")
