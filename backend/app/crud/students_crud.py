from sqlalchemy.orm import Session
from fastapi import HTTPException
from app import models, schemas
from .users_crud import get_user_by_id, update_user_profile

def get_student_by_user_id(db: Session, user_id: int) -> models.Student | None:
    return db.query(models.Student).filter(models.Student.user_id == user_id).first()

def get_student_by_id(db: Session, student_id: int) -> models.Student | None:
    return db.query(models.Student).filter(models.Student.student_id == student_id).first()

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

def is_admin(role: schemas.RoleEnum) -> bool:
    return role == schemas.RoleEnum.admin

def is_own_data(user_id: int, data_id: int) -> bool:
    return user_id == data_id

def update_student_profile_service(db: Session, payload: dict, student_in: schemas.StudentUpdate) -> schemas.StudentUpdate:
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

def delete_student(db: Session, student_id: int) -> bool:
    student = get_student_by_id(db, student_id)
    if student:
        db.delete(student)
        db.commit()
        return True
    return False
