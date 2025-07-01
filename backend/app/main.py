
from fastapi import FastAPI
from app.routers import auth, students, counselors, appointments, time_slots, public

app = FastAPI(title="Academic Counseling API")


app.include_router(auth.router)
app.include_router(students.router)
app.include_router(counselors.router)
app.include_router(appointments.router)
app.include_router(time_slots.router)
app.include_router(public.router)
