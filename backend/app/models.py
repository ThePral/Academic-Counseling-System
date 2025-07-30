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


class ActivityStatus(str, enum.Enum):
    pending = "pending"
    done = "done"
    not_done = "not_done"

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
    study_plans = relationship("StudyPlan", back_populates="student")


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
    study_plans = relationship("StudyPlan", back_populates="counselor")


# ----- STUDY PLAN -----

class StudyPlan(Base):
    __tablename__ = "study_plans"

    plan_id = Column(Integer, primary_key=True, index=True)
    counselor_id = Column(Integer, ForeignKey("counselors.counselor_id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_finalized = Column(Boolean, default=False)

    is_submitted_by_student = Column(Boolean, default=False)
    student_submit_time = Column(DateTime, nullable=True)
    counselor_feedback = Column(String, nullable=True)
    counselor_feedback_time = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="study_plans")
    counselor = relationship("Counselor", back_populates="study_plans")
    activities = relationship("StudyActivity", back_populates="plan")


class StudyActivity(Base):
    __tablename__ = "study_activities"

    activity_id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("study_plans.plan_id"), nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)


    status = Column(PGEnum(ActivityStatus, name="activity_status_enum"), default=ActivityStatus.pending)
    student_note = Column(String, nullable=True)

    plan = relationship("StudyPlan", back_populates="activities")


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



