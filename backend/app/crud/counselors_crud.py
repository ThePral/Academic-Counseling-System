from sqlalchemy.orm import Session
from fastapi import HTTPException
from app import models, schemas
from .users_crud import get_user_by_id, update_user_profile
from sqlalchemy.orm import joinedload
from datetime import datetime, timedelta

def get_counselor_by_user_id(db: Session, user_id: int) -> models.Counselor | None:
    return db.query(models.Counselor).filter(models.Counselor.user_id == user_id).first()

def get_counselor_by_id(db: Session, counselor_id: int) -> models.Counselor | None:
    return db.query(models.Counselor).filter(models.Counselor.counselor_id == counselor_id).first()

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

def is_admin(role: schemas.RoleEnum) -> bool:
    return role == schemas.RoleEnum.admin

def is_own_data(user_id: int, data_id: int) -> bool:
    return user_id == data_id

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

def delete_counselor(db: Session, counselor_id: int) -> bool:
    counselor = get_counselor_by_id(db, counselor_id)
    if counselor:
        db.delete(counselor)
        db.commit()
        return True
    return False



def get_students_of_counselor(db: Session, counselor_user_id: int):
    counselor = db.query(models.Counselor).filter(models.Counselor.user_id == counselor_user_id).first()
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")

    student_ids_subq = (
        db.query(models.Appointment.student_id)
        .filter(models.Appointment.counselor_id == counselor.counselor_id)
        .distinct()
        .subquery()
    )

    students = (
        db.query(models.Student)
        .options(joinedload(models.Student.user))  
        .filter(models.Student.student_id.in_(student_ids_subq))
        .all()
    )
    
    student_out_list = []
    for s in students:
        student_out_list.append(schemas.StudentOut(
            student_id=s.student_id,
            phone_number=s.phone_number,
            province=s.province,
            city=s.city,
            academic_year=s.academic_year,
            major=s.major,
            gpa=s.gpa,
            profile_image_url=s.user.profile_image_url if s.user else None,
            firstname=s.user.firstname if s.user else "",
            lastname=s.user.lastname if s.user else "",
            email=s.user.email if s.user else ""
        ))

    return student_out_list


def get_counselor_dashboard_data(db: Session, counselor_user_id: int):
    counselor = db.query(models.Counselor).filter(
        models.Counselor.user_id == counselor_user_id
    ).first()

    if not counselor:
        return {"error": "Counselor not found"}

    today = datetime.utcnow().date()

    past_sessions = db.query(models.Appointment).filter(
        models.Appointment.counselor_id == counselor.counselor_id,
        models.Appointment.status == models.AppointmentStatus.approved,
        models.Appointment.date < today
    ).count()

    future_approved = db.query(models.Appointment).filter(
        models.Appointment.counselor_id == counselor.counselor_id,
        models.Appointment.status == models.AppointmentStatus.approved,
        models.Appointment.date >= today
    ).count()

    student_count = db.query(models.Appointment.student_id).filter(
        models.Appointment.counselor_id == counselor.counselor_id
    ).distinct().count()

    return {
        "recent_sessions": past_sessions,
        "upcoming_approved_requests": future_approved,
        "unique_students": student_count
    }