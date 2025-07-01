from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean, Time, Date
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

# ----- ENUM DEFINITIONS -----

class RoleEnum(enum.Enum):
    student = "student"
    counselor = "counselor"
    admin = "admin"

class AppointmentStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    cancelled = "cancelled"

class NotificationStatus(str, enum.Enum):
    unread = "unread"
    read = "read"

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"


# ----- USER -----

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
    notifications = relationship("Notification", back_populates="user")
    media_files = relationship("MediaFile", back_populates="user")
    sent_messages = relationship("ChatMessage", foreign_keys='ChatMessage.sender_id', back_populates="sender")
    received_messages = relationship("ChatMessage", foreign_keys='ChatMessage.receiver_id', back_populates="receiver")


# ----- STUDENT -----

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
    recommendations = relationship("Recommendation", back_populates="student")
    feedbacks = relationship("Feedback", back_populates="student")
    payments = relationship("Payment", back_populates="student")


# ----- COUNSELOR -----

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
    feedbacks = relationship("Feedback", back_populates="counselor")
    payments = relationship("Payment", back_populates="counselor")


# ----- APPOINTMENT -----

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    counselor_id = Column(Integer, ForeignKey("counselors.counselor_id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("available_time_slots.id"), nullable=False)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    status = Column(PGEnum(AppointmentStatus, name="appointment_status_enum"), default=AppointmentStatus.pending)
    notes = Column(String, nullable=True)

    student = relationship("Student", back_populates="appointments")
    counselor = relationship("Counselor", back_populates="appointments")
    slot = relationship("AvailableTimeSlot")


# ----- COUNSELOR TIME RANGE -----

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


# ----- AVAILABLE TIME SLOT -----

class AvailableTimeSlot(Base):
    __tablename__ = "available_time_slots"

    id = Column(Integer, primary_key=True, index=True)
    range_id = Column(Integer, ForeignKey("counselor_time_ranges.id"), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_reserved = Column(Boolean, default=False)

    time_range = relationship("CounselorTimeRange", back_populates="slots")


# ----- NOTIFICATION -----

class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.userid"), nullable=False)
    message = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(PGEnum(NotificationStatus, name="notification_status_enum"), default=NotificationStatus.unread)

    user = relationship("User", back_populates="notifications")


# ----- CHAT MESSAGE -----

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    message_id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.userid"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.userid"), nullable=False)
    text = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")


# ----- MEDIA -----

class MediaFile(Base):
    __tablename__ = "media_files"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.userid"), nullable=False)
    file_type = Column(String, nullable=False)  # مثلا: assignment, plan, profile
    file_url = Column(String, nullable=False)  # فقط URL فضای ابری
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="media_files")


# ----- RECOMMENDATION -----

class Recommendation(Base):
    __tablename__ = "recommendations"

    recommendation_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    suggested_course = Column(String, nullable=True)
    career_suggestion = Column(String, nullable=True)

    student = relationship("Student", back_populates="recommendations")


# ----- FEEDBACK -----

class Feedback(Base):
    __tablename__ = "feedback"

    feedback_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    counselor_id = Column(Integer, ForeignKey("counselors.counselor_id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(String, nullable=True)
    date_submitted = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="feedbacks")
    counselor = relationship("Counselor", back_populates="feedbacks")


# ----- PAYMENT -----

class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    counselor_id = Column(Integer, ForeignKey("counselors.counselor_id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_date = Column(DateTime, default=datetime.utcnow)
    status = Column(PGEnum(PaymentStatus, name="payment_status_enum"), default=PaymentStatus.pending)
    transaction_id = Column(String, nullable=True)

    student = relationship("Student", back_populates="payments")
    counselor = relationship("Counselor", back_populates="payments")
