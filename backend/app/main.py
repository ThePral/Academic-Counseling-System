from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import models, schemas, crud, auth
from .database import engine, get_db
from .models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Academic Counseling Auth API")


@app.post("/signup", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.create_user(db, user_in)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or phone number already registered"
        )
    return user


@app.post("/login", response_model=schemas.Token)
def login(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    access_token = auth.create_access_token(subject=user.userid, role=user.role)
    refresh_token = auth.create_refresh_token(subject=user.userid)
    return {"access_token": access_token, "refresh_token": refresh_token}


@app.post("/refresh", response_model=schemas.Token)
def refresh_token(token: schemas.Token, db: Session = Depends(get_db)):
    payload = auth.decode_token(token.refresh_token, refresh=True)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_access = auth.create_access_token(subject=user.userid, role=user.role)
    new_refresh = auth.create_refresh_token(subject=user.userid)
    return {"access_token": new_access, "refresh_token": new_refresh}


@app.get("/me", response_model=schemas.UserOut)
def read_current_user(payload: dict = Depends(auth.JWTBearer()), db: Session = Depends(get_db)):
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
