from fastapi import FastAPI
from .database import Base, engine
from app.routers import  authentication,students, counselors, appointments, time_slots, public, reset_password, study_plan, notifications, admin
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Academic Counseling API")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication.router)
app.include_router(students.router)
app.include_router(counselors.router)
app.include_router(appointments.router)
app.include_router(time_slots.router)
app.include_router(public.router)
app.include_router(reset_password.router)
app.include_router(study_plan.router)
app.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
app.include_router(admin.router)


