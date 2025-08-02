# app/crud/admin_crud.py

from sqlalchemy.orm import Session
from fastapi import HTTPException
from app import models, schemas, crud
from app.crud import users_crud
from typing import Optional
from app.models import RoleEnum

def list_users(db: Session, role: Optional[RoleEnum] = None):
    query = db.query(models.User)
    if role:
        query = query.filter(models.User.role == role)
    return query.all()

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.userid == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    student = db.query(models.Student).filter(models.Student.user_id == user_id).first()
    if student:
        db.delete(student)

    counselor = db.query(models.Counselor).filter(models.Counselor.user_id == user_id).first()
    if counselor:
        db.delete(counselor)

    db.delete(user)
    db.commit()


def update_user(db: Session, user_id: int, user_in: schemas.UserUpdate):
    user = db.query(models.User).filter(models.User.userid == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_in.firstname:
        user.firstname = user_in.firstname
    if user_in.lastname:
        user.lastname = user_in.lastname
    if user_in.email:
        user.email = user_in.email

    db.commit()
    db.refresh(user)
    return user

def create_user(db: Session, user_in: schemas.UserCreate):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return users_crud.create_user(db, user_in)
