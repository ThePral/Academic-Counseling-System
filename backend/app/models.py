from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean, Time, Date
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base
from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Enum
from sqlalchemy.orm import relationship
import enum
from .database import Base


class RoleEnum(enum.Enum):
    student = "student"
    counselor = "counselor"
    admin = "admin"

class AppointmentStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    cancelled = "cancelled" 

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
    appointments = relationship("Appointment", back_populates="student")


class Counselor(Base):
    __tablename__ = "counselors"
    counselor_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.userid"), nullable=False)
    phone_number = Column(String, unique=True, nullable=True)
    province = Column(String, nullable=True)
    city = Column(String, nullable=True)
    department = Column(String, nullable=True)

    user = relationship("User", back_populates="counselor")
    time_ranges = relationship("CounselorTimeRange", back_populates="counselor")
    appointments = relationship("Appointment", back_populates="counselor")

class CounselorTimeRange(Base):
    __tablename__ = "counselor_time_ranges"

    id = Column(Integer, primary_key=True, index=True)
    counselor_id = Column(Integer, ForeignKey("counselors.counselor_id"), nullable=False)
    date = Column(Date, nullable=False)
    from_time = Column(Time, nullable=False)
    to_time = Column(Time, nullable=False)
    duration = Column(Integer, nullable=False)

    counselor = relationship("Counselor", back_populates="time_ranges")
    slots = relationship("AvailableTimeSlot", back_populates="time_range")

    
class AvailableTimeSlot(Base):
    __tablename__ = "available_time_slots"

    id = Column(Integer, primary_key=True, index=True)
    range_id = Column(Integer, ForeignKey("counselor_time_ranges.id"), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_reserved = Column(Boolean, default=False)

    time_range = relationship("CounselorTimeRange", back_populates="slots")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    counselor_id = Column(Integer, ForeignKey("counselors.counselor_id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("available_time_slots.id"), nullable=False)
    date = Column(Date)   # 🟢 روز مشاوره
    time = Column(Time)   # 🟢 ساعت شروع مشاوره
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.pending)
    notes = Column(String, nullable=True)

    student = relationship("Student", back_populates="appointments")
    counselor = relationship("Counselor", back_populates="appointments")
    slot = relationship("AvailableTimeSlot")
