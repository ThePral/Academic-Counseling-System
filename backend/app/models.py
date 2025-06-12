from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import ENUM as PGEnum, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class RoleEnum(enum.Enum):
    student = "student"
    counselor = "counselor"
    admin = "admin"

class DayOfWeek(enum.Enum):
    sunday = "sunday"
    monday = "monday"
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"
    saturday = "saturday"

class TimeSlot(enum.Enum):
    slot_8_9   = "8-9"
    slot_10_11 = "10-11"
    slot_13_14 = "13-14"
    slot_15_16 = "15-16"
    slot_17_18 = "17-18"


class User(Base):
    __tablename__ = "users"

    userid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(PGEnum(RoleEnum, name="role_enum"), nullable=False, default=RoleEnum.student)
    registrationDate = Column(DateTime, default=datetime.utcnow)
    profile_image_url = Column(String, nullable=True)  
    profile_image_filename = Column(String, nullable=True) 
    
    student = relationship("Student", back_populates="user", uselist=False)
    counselor = relationship("Counselor", back_populates="user", uselist=False)

class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.userid"), nullable=False)
    phone_number = Column(String, unique=True, nullable=True)
    province = Column(String, nullable=True)
    city = Column(String, nullable=True)
    academic_year = Column(String, nullable=True)  
    major = Column(String, nullable=True) 
    gpa = Column(Float, nullable=True)

    user = relationship("User", back_populates="student")

class Counselor(Base):
    __tablename__ = "counselors"

    counselor_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.userid"), nullable=False)
    phone_number = Column(String, unique=True, nullable=True)
    province = Column(String, nullable=True)
    city = Column(String, nullable=True)
    department = Column(String, nullable=True)

    user = relationship("User", back_populates="counselor")
    available_slots = relationship("CounselorAvailableSlot", back_populates="counselor", cascade="all, delete-orphan")
class CounselorAvailableSlot(Base):
    __tablename__ = "counselor_available_slots"

    available_slots_id = Column(Integer, primary_key=True, autoincrement=True)
    counselor_id = Column(Integer, ForeignKey("counselors.counselor_id"), nullable=False)
    day = Column(PGEnum(DayOfWeek, name="day_enum"), nullable=False)
    slot = Column(PGEnum(TimeSlot, name="time_slot_enum"), nullable=False)

    counselor = relationship("Counselor", back_populates="available_slots")
