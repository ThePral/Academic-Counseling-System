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
from .models import TimeSlot, DayOfWeek

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
    s3.upload_fileobj(file.file, LIARA_BUCKET_NAME, file.filename)
    return file.filename 

def update_user_profile_with_image(db: Session, user_id: int, file: UploadFile):
    user = db.query(models.User).filter(models.User.userid == user_id).first()
    file_name = upload_file_to_s3(file)
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






def create_available_slot(db: Session, available_slot_in: schemas.CounselorAvailableSlotCreate, payload: dict = Depends(auth.JWTBearer())):

    user_id = int(payload.get("sub"))

    counselor = db.query(models.Counselor).filter(models.Counselor.user_id == user_id).first()

    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")
    
    existing_slot = db.query(models.CounselorAvailableSlot).filter(
        models.CounselorAvailableSlot.counselor_id == counselor.counselor_id,
        models.CounselorAvailableSlot.day == available_slot_in.day,
        models.CounselorAvailableSlot.slot == available_slot_in.slot).first()
    if existing_slot:
        raise HTTPException(status_code=400, detail="Slot already exists")
    
    new_slot = models.CounselorAvailableSlot(
        counselor_id=counselor.counselor_id,
        day=available_slot_in.day,
        slot=available_slot_in.slot
    )  
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    
    return new_slot


def get_available_slots(db: Session, payload: dict = Depends(auth.JWTBearer())):
    user_id = int(payload.get("sub"))
    counselor = db.query(models.Counselor).filter(models.Counselor.user_id == user_id).first()

    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")
    return db.query(models.CounselorAvailableSlot).filter(models.CounselorAvailableSlot.counselor_id == counselor.counselor_id).all()



def delete_available_slot(db: Session, available_slots_id: int, payload: dict = Depends(auth.JWTBearer())):
    user_id = int(payload.get("sub"))
    counselor = db.query(models.Counselor).filter(models.Counselor.user_id == user_id).first()

    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")

    slot_to_delete = db.query(models.CounselorAvailableSlot).filter(
        models.CounselorAvailableSlot.counselor_id == counselor.counselor_id,
        models.CounselorAvailableSlot.available_slots_id == available_slots_id).first()

    if not slot_to_delete:
        raise HTTPException(status_code=404, detail="Slot not found")

    db.delete(slot_to_delete)
    db.commit()

    return {"message": "Slot deleted"}


