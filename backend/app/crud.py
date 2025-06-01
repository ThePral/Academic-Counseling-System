from sqlalchemy.orm import Session
from . import models, schemas, auth


def create_user(db: Session, user_in: schemas.UserCreate) -> models.User:
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        return None
    hashed = auth.get_hashed_password(user_in.password)
    db_user = models.User(
        firstname=user_in.firstname,
        lastname=user_in.lastname,
        email=user_in.email,
        phone_number=user_in.phone_number,
        password_hash=hashed,
        role=user_in.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

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
