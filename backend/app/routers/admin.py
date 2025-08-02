from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.auth import verify_admin, JWTBearer
from app.database import get_db
from app.crud import admin_crud
from typing import Optional
from app.models import RoleEnum

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users")
def list_users(role: Optional[RoleEnum] = None, db: Session = Depends(get_db)):
    return admin_crud.list_users(db, role=role)


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), _: bool = Depends(verify_admin)):
    admin_crud.delete_user(db, user_id)
    return {"detail": "User deleted"}



@router.put("/users/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, user_in: schemas.UserUpdate, db: Session = Depends(get_db), _: bool = Depends(verify_admin)):
    return admin_crud.update_user(db, user_id, user_in)

@router.post("/users", response_model=schemas.UserOut)
def create_user(user_in: schemas.UserCreate, db: Session = Depends(get_db), _: bool = Depends(verify_admin)):
    return admin_crud.create_user(db, user_in)
