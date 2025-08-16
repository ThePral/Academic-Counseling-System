import React from "react";

const StudentInfoCard = ({ student }) => {
  if (!student) return null;

  return (
    <div className="bg-black text-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto border border-[#4267B2]">
      <div className="flex items-center gap-4">
        <img
          src={student.profile_image_url}
          alt="student"
          className="w-20 h-20 rounded-full border-2 border-[#FFEA00] object-cover"
        />
        <div>
          <h2 className="text-xl font-bold text-[#FFEA00]">
            {student.firstname} {student.lastname}
          </h2>
          <p className="text-sm text-[#4267B2]">{student.email}</p>
          <p className="text-sm text-[#4267B2]">{student.phone_number}</p>
        </div>
      </div>

      <hr className="my-4 border-[#4267B2]" />

      <div className="space-y-2">
        <p>
          <strong className="text-[#FFEA00]">استان:</strong> {student.province}
        </p>
        <p>
          <strong className="text-[#FFEA00]">شهر:</strong> {student.city}
        </p>
        <p>
          <strong className="text-[#FFEA00]">مقطع تحصیلی:</strong>{" "}
          {student.education_year}
        </p>
        <p>
          <strong className="text-[#FFEA00]">رشته:</strong>{" "}
          {student.field_of_study}
        </p>
        <p>
          <strong className="text-[#FFEA00]">ترم / سال:</strong>{" "}
          {student.semester_or_year}
        </p>
        <p>
          <strong className="text-[#FFEA00]">معدل:</strong> {student.gpa}
        </p>
      </div>
    </div>
  );
};

export default StudentInfoCard;
