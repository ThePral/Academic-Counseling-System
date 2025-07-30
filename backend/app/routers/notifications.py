from fastapi import APIRouter, Depends, HTTPException
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

@router.patch("/{notification_id}/read", response_model=schemas.NotificationOut)
def mark_notification_as_read(notification_id: int, db: Session = Depends(get_db)):
    notification = crud.mark_as_read(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

@router.delete("/{notification_id}", status_code=204)
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = crud.delete_notification(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return