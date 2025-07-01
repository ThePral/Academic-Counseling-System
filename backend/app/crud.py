from sqlalchemy.orm import Session
from . import models, schemas, auth
from .schemas import RoleEnum
from fastapi import HTTPException, Depends
import boto3
from botocore.exceptions import NoCredentialsError  
from dotenv import load_dotenv
import os
from typing import Optional
from fastapi import UploadFile, File
import io
from fastapi import UploadFile
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models import CounselorTimeRange, AvailableTimeSlot


def is_admin(user_role: RoleEnum) -> bool:
    return user_role == RoleEnum.admin

def is_own_data(user_id: int, data_id: int) -> bool:
    return user_id == data_id


load_dotenv()

LIARA_ENDPOINT = os.getenv("LIARA_ENDPOINT_URL")
LIARA_ACCESS_KEY = os.getenv("LIARA_ACCESS_KEY")
LIARA_SECRET_KEY = os.getenv("LIARA_SECRET_KEY")
LIARA_BUCKET_NAME = os.getenv("BUCKET_NAME")

s3 = boto3.client(
    "s3",
    endpoint_url=LIARA_ENDPOINT,
    aws_access_key_id=LIARA_ACCESS_KEY,
    aws_secret_access_key=LIARA_SECRET_KEY,
)

def upload_file_to_s3(file : UploadFile):
    print("nvnvhjfjncbnn")
    s3.upload_fileobj(file.file, LIARA_BUCKET_NAME, file.filename)
    print("nvnvhjfjncbn")
    return file.filename 

def update_user_profile_with_image(db: Session, user_id: int, file: UploadFile):
    user = db.query(models.User).filter(models.User.userid == user_id).first()
    file_name = upload_file_to_s3(file)
    print("nvnvhjfjncbn")
    profile_image_url = f"/{LIARA_BUCKET_NAME}/{file_name}"  
    user.profile_image_filename = file_name
    user.profile_image_url = profile_image_url
    db.commit()
    db.refresh(user)

    return user

def create_user(db: Session, user_in: schemas.UserCreate, file: Optional[UploadFile] = None) -> models.User:
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        return None

    db_user = models.User(
        firstname=user_in.firstname,
        lastname=user_in.lastname,
        email=user_in.email,
        password_hash=auth.get_hashed_password(user_in.password),
        role=user_in.role
    )
    db.add(db_user)
    db.commit() 
    db.refresh(db_user) 

    if user_in.role == models.RoleEnum.student:
        db_student = models.Student(user_id=db_user.userid)  
        db.add(db_student)
        db.commit() 
        db.refresh(db_student) 
    elif user_in.role == models.RoleEnum.counselor:
        db_counselor = models.Counselor(user_id=db_user.userid)  
        db.add(db_counselor)
        db.commit()  
        db.refresh(db_counselor)  

    return db_user


def change_user_password(db: Session, email: str, new_password: str) -> bool:
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return False
    user.password_hash = auth.get_hashed_password(new_password)
    db.commit()
    db.refresh(user) 
    return True

# ==== Read ====

def get_user_by_email(db: Session, email: str) -> models.User | None:
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, userid: int) -> models.User | None:
    return db.query(models.User).get(userid)

# ==== Authenticate (Read + Verify) ====

def authenticate_user(db: Session, email: str, password: str) -> models.User | None:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not auth.verify_password(password, user.password_hash):
        return None
    
    return user

# ==== Update ====

def update_user_password(db: Session, userid: int, new_password: str) -> models.User:
    user = get_user_by_id(db, userid)
    user.password_hash = auth.get_hashed_password(new_password)
    db.commit()
    db.refresh(user)
    return user

def update_user_role(db: Session, userid: int, new_role: str) -> models.User:
    user = get_user_by_id(db, userid)
    user.role = new_role
    db.commit()
    db.refresh(user)
    return user

# ==== Delete ====

def delete_user(db: Session, userid: int) -> bool:
    user = get_user_by_id(db, userid)
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True

# ==== Read ====

def get_student_by_user_id(db: Session, user_id: int) -> models.Student | None:
    return db.query(models.Student).filter(models.Student.user_id == user_id).first()

def get_counselor_by_user_id(db: Session, user_id: int) -> models.Counselor | None:
    return db.query(models.Counselor).filter(models.Counselor.user_id == user_id).first()

def get_student_by_id(db: Session, student_id: int) -> models.Student | None:
    return db.query(models.Student).filter(models.Student.student_id == student_id).first()

def get_counselor_by_id(db: Session, counselor_id: int) -> models.Counselor | None:
    return db.query(models.Counselor).filter(models.Counselor.counselor_id == counselor_id).first()

#couselor by id 
def get_counselor_by_id_service(db: Session, counselor_id: int) -> schemas.CounselorOut:
    counselor = get_counselor_by_id(db, counselor_id)
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")

    user = get_user_by_id(db, counselor.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User associated with counselor not found")

    return schemas.CounselorOut(
        firstname=user.firstname,
        lastname=user.lastname,
        email=user.email,
        phone_number=counselor.phone_number,
        province=counselor.province,
        city=counselor.city,
        department=counselor.department if counselor.department else None,
        profile_image_url=user.profile_image_url
    )

#counselor, student get me
def get_counselor_info(db: Session, payload: dict) -> schemas.CounselorOut:
    user_id = int(payload.get("sub"))
    user = get_user_by_id(db, user_id)
    counselor = get_counselor_by_user_id(db, user_id)

    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")

    return schemas.CounselorOut(
        firstname=user.firstname,
        lastname=user.lastname,
        email=user.email,
        phone_number=counselor.phone_number,
        province=counselor.province,
        city=counselor.city,
        department=counselor.department if counselor.department else None,
        profile_image_url=user.profile_image_url
    )
def get_student_info(db: Session, payload: dict) -> schemas.StudentOut:
    user_id = int(payload.get("sub"))
    user = get_user_by_id(db, user_id)
    student = get_student_by_user_id(db, user_id)

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return schemas.StudentOut(
        firstname=user.firstname,
        lastname=user.lastname,
        email=user.email,
        phone_number=student.phone_number,
        province=student.province,
        city=student.city,
        academic_year=student.academic_year,
        major=student.major,
        gpa=student.gpa,
        profile_image_url=user.profile_image_url
    )
# ==== Update ====
def update_user_profile(db: Session, user_id: int, user_in: schemas.StudentUpdate | schemas.CounselorUpdate):
    user = db.query(models.User).filter(models.User.userid == user_id).first()
    if user:
        if user_in.firstname:
            user.firstname = user_in.firstname
        if user_in.lastname:
            user.lastname = user_in.lastname
        if user_in.email:
            user.email = user_in.email
        db.commit()
        db.refresh(user)
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")  

def update_student_profile(db: Session, student_id: int, student_in: schemas.StudentUpdate):
    student = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    if student:
        if student_in.phone_number:
            student.phone_number = student_in.phone_number
        if student_in.province:
            student.province = student_in.province    
        if student_in.city:
            student.city = student_in.city 
        if student_in.academic_year:
            student.academic_year = student_in.academic_year    
        if student_in.major:
            student.major = student_in.major
        if student_in.gpa is not None:
            student.gpa = student_in.gpa
        db.commit()
        db.refresh(student)
        return student
    else:
        raise HTTPException(status_code=404, detail="Student not found") 
def update_student_profile_service(db: Session,payload: dict,student_in: schemas.StudentUpdate) -> schemas.StudentUpdate:
    user_id = int(payload.get("sub"))
    user = get_user_by_id(db, user_id)
    student = get_student_by_user_id(db, user_id)

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if is_admin(user.role) or is_own_data(user_id, student.user_id):
        student = update_student_profile(db, student.student_id, student_in)
        user = update_user_profile(db, user_id, student_in)
        return schemas.StudentUpdate(
            firstname=user.firstname,
            lastname=user.lastname,
            email=user.email,
            phone_number=student.phone_number,
            province=student.province,
            city=student.city,
            academic_year=student.academic_year,
            major=student.major,
            gpa=student.gpa
        )
    else:
        raise HTTPException(status_code=403, detail="Permission denied")


def update_counselor_profile(db: Session, user_id: int, counselor_in: schemas.CounselorUpdate):
    counselor = db.query(models.Counselor).filter(models.Counselor.user_id == user_id).first()
    
    if counselor:
        if counselor_in.phone_number:
            counselor.phone_number = counselor_in.phone_number
        if counselor_in.province:
            counselor.province = counselor_in.province    
        if counselor_in.city:
            counselor.city = counselor_in.city 
        if counselor_in.department:
            counselor.department = counselor_in.department 
        
        db.commit()
        db.refresh(counselor)
        return counselor
    return None
def update_counselor_profile_service(db: Session, payload: dict, counselor_in: schemas.CounselorUpdate) -> schemas.CounselorUpdate:
    user_id = int(payload.get("sub"))
    user = get_user_by_id(db, user_id)
    counselor = get_counselor_by_user_id(db, user_id)

    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")

    if is_admin(user.role) or is_own_data(user_id, counselor.user_id):
        counselor = update_counselor_profile(db, counselor.user_id, counselor_in)
        user = update_user_profile(db, user_id, counselor_in)
        return schemas.CounselorUpdate(
            firstname=user.firstname,
            lastname=user.lastname,
            email=user.email,
            phone_number=counselor.phone_number,
            province=counselor.province,
            city=counselor.city,
            department=counselor.department if counselor.department else None
        )
    else:
        raise HTTPException(status_code=403, detail="Permission denied")




# ==== Delete ====

def delete_student(db: Session, student_id: int) -> bool:
    student = get_student_by_id(db, student_id)
    if student:
        db.delete(student)
        db.commit()
        return True
    return False

def delete_counselor(db: Session, counselor_id: int) -> bool:
    counselor = get_counselor_by_id(db, counselor_id)
    if counselor:
        db.delete(counselor)
        db.commit()
        return True
    return False

def get_student_by_user_id(db: Session, user_id: int) -> models.Student | None:
    return db.query(models.Student).filter(models.Student.user_id == user_id).first()

def get_counselor_by_user_id(db: Session, user_id: int) -> models.Counselor | None:
    return db.query(models.Counselor).filter(models.Counselor.user_id == user_id).first()

def get_all_counselors(db: Session):
    return db.query(models.User).filter(models.User.role== RoleEnum.counselor).all()





def check_range_overlap(db: Session, counselor_id: int, date, from_time, to_time) -> bool:
    return db.query(CounselorTimeRange).filter(
        CounselorTimeRange.counselor_id == counselor_id,
        CounselorTimeRange.date == date,
        CounselorTimeRange.from_time < to_time,
        CounselorTimeRange.to_time > from_time
    ).first() is not None


def create_time_range_with_slots(db: Session, counselor_id: int, date, from_time, to_time, duration_minutes: int):
    time_range = CounselorTimeRange(
        counselor_id=counselor_id,
        date=date,
        from_time=from_time,
        to_time=to_time,
        duration=duration_minutes
    )
    db.add(time_range)
    db.flush()

    current = datetime.combine(date, from_time)
    end = datetime.combine(date, to_time)

    slots = []
    while current + timedelta(minutes=duration_minutes) <= end:
        slot = AvailableTimeSlot(
            range_id=time_range.id,
            start_time=current.time(),
            end_time=(current + timedelta(minutes=duration_minutes)).time(),
            is_reserved=False,
        )
        db.add(slot)
        slots.append(slot)
        current += timedelta(minutes=duration_minutes)

    db.commit()
    return time_range, slots


def get_ranges_by_counselor(db: Session, counselor_id: int):
    return db.query(CounselorTimeRange).filter(CounselorTimeRange.counselor_id == counselor_id).all()


def get_slots_by_range(db: Session, range_id: int):
    return db.query(AvailableTimeSlot).filter(AvailableTimeSlot.range_id == range_id).all()


def delete_range_by_id(db: Session, range_id: int):
    obj = db.query(CounselorTimeRange).filter(CounselorTimeRange.id == range_id).first()
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


def delete_slot_by_id(db: Session, slot_id: int):
    obj = db.query(AvailableTimeSlot).filter(AvailableTimeSlot.id == slot_id).first()
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True



#appoinment
def create_appointment(db: Session, student_id: int, slot_id: int, notes: Optional[str] = None):
    slot = db.query(models.AvailableTimeSlot).filter(models.AvailableTimeSlot.id == slot_id).first()

    if not slot or slot.is_reserved:
        raise HTTPException(400, "Slot not available")

    counselor_id = slot.time_range.counselor_id
    print(counselor_id)
    appointment_datetime = datetime.combine(slot.time_range.date, slot.start_time)
    
    print("sjjcbl", student_id)
    print()
    appointment = models.Appointment(
        student_id=student_id,
        counselor_id=counselor_id,
        slot_id=slot.id,
        date=slot.time_range.date, 
        time=slot.start_time,
        status=models.AppointmentStatus.pending,
        notes=notes
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

def approve_appointment(db: Session, appointment_id: int):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(404, "Appointment not found")

    appointment.status = models.AppointmentStatus.approved
    appointment.slot.is_reserved = True
    db.commit()
    return appointment

def cancel_appointment(db: Session, appointment_id: int):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(404, "Appointment not found")

    appointment.slot.is_reserved = False
    db.delete(appointment)
    db.commit()
    return True

