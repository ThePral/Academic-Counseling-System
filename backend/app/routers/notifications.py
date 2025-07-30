from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.NotificationOut)
def send_notification(notification: schemas.NotificationCreate, db: Session = Depends(get_db)):
    return crud.create_notification(db, notification)

@router.get("/{user_id}", response_model=list[schemas.NotificationOut])
def list_notifications(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_notifications(db, user_id)
