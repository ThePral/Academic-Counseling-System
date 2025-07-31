# appointments_crud.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app import models
from datetime import datetime
from typing import Optional

def create_appointment(db: Session, student_id: int, slot_id: int, notes: Optional[str] = None):
    slot = db.query(models.AvailableTimeSlot).filter(models.AvailableTimeSlot.id == slot_id).first()
    if not slot or slot.is_reserved:
        raise HTTPException(400, "Slot not available")

    counselor_id = slot.time_range.counselor_id
    appointment = models.Appointment(
        student_id=student_id,
        counselor_id=counselor_id,
        slot_id=slot.id,
        date=slot.time_range.date,
        time=slot.start_time,
        status=models.AppointmentStatus.pending,
        notes=notes
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

def approve_appointment(db: Session, appointment_id: int):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(404, "Appointment not found")
    appointment.status = models.AppointmentStatus.approved
    appointment.slot.is_reserved = True
    db.commit()
    return appointment

def cancel_appointment(db: Session, appointment_id: int):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(404, "Appointment not found")
    appointment.slot.is_reserved = False
    db.delete(appointment)
    db.commit()
    return True




def get_appointments_by_status(db: Session, counselor_user_id: int, status: models.AppointmentStatus):
    
    counselor = db.query(models.Counselor).filter(models.Counselor.user_id == counselor_user_id).first()
    if not counselor:
        return []

    appointments = db.query(models.Appointment, models.Student, models.User).join(models.Student, models.Appointment.student_id == models.Student.student_id) \
        .join(models.User, models.Student.user_id == models.User.userid) \
        .filter(
            models.Appointment.counselor_id == counselor.counselor_id,
            models.Appointment.status == status
        ).all()

    # ساخت خروجی
    result = []
    for app, student, user in appointments:
        result.append({
            "firstname": user.firstname,
            "lastname": user.lastname,
            "date": app.date,
            "start_time": app.time,
            "end_time": app.slot.end_time  
        })
    return result
