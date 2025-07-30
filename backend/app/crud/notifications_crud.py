from sqlalchemy.orm import Session
from models import Notification
from schemas import NotificationCreate

def create_notification(db: Session, notification: NotificationCreate):
    db_item = Notification(**notification.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_user_notifications(db: Session, user_id: int):
    return db.query(Notification).filter(Notification.user_id == user_id).all()
