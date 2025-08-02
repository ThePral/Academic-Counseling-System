from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud,schemas
from typing import List
from app.auth import JWTBearer


router = APIRouter(
    prefix="/study-plan",
    tags=["Study Plan"]
)

@router.post("/counselor/create")
def create_plan(
    data: schemas.StudyPlanCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(JWTBearer())
):
    counselor_user_id = payload["sub"]
    return crud.create_study_plan(db, counselor_user_id, data)

@router.post("/counselor/finalize/{plan_id}")
def finalize(plan_id: int, db: Session = Depends(get_db)):
    crud.finalize_plan(db, plan_id)
    return {"detail": "Plan finalized"}


@router.get("/student/my")
def get_my_plan(
    db: Session = Depends(get_db),
    payload: dict = Depends(JWTBearer())
):
    student_id = payload["sub"]
    plan = crud.get_student_weekly_plan(db, student_id)
    if not plan:
        raise HTTPException(status_code=404, detail="No finalized plan found")
    return plan


@router.post("/student/update-status")
def update_status(
    updates: List[schemas.ActivityStatusUpdate],
    db: Session = Depends(get_db),
    payload: dict = Depends(JWTBearer())
):
    user_id = int(payload["sub"])
    crud.update_activity_status(db, user_id, updates)
    return {"detail": "Status updated"}


@router.post("/student/submit-status")
def submit_status(payload: dict = Depends(JWTBearer()), db: Session = Depends(get_db)):
    user_id = int(payload["sub"])
    crud.student_submit_status(db, user_id)
    return {"detail": "Status submitted"}

@router.get("/counselor/review/{student_id}")
def review_plan(student_id: int, db: Session = Depends(get_db)):
    plan = crud.get_plan_for_review(db, student_id)
    if not plan:
        raise HTTPException(status_code=404, detail="No submitted plan found")
    return plan


@router.post("/counselor/submit-feedback")
def submit_feedback(data: schemas.CounselorFeedback, db: Session = Depends(get_db)):
    crud.submit_counselor_feedback(db, data.plan_id, data.feedback)
    return {"detail": "Feedback submitted"}


@router.post("/counselor/score")
def give_score(
    data: schemas.ScoreInput,
    db: Session = Depends(get_db),
    payload: dict = Depends(JWTBearer()) 
):
    return crud.set_plan_score(db, data.plan_id, data.score)


@router.post("/counselor/recommend")
def create_recommendation_for_student(
    data: schemas.RecommendationCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(JWTBearer())
):
    counselor_user_id = payload["sub"]
    return crud.create_recommendation(db, data.student_id, counselor_user_id, data.suggested_course)
