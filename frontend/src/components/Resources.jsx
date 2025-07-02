import React, { useState } from 'react';
import './style/Resources.css';
import { FaDownload } from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const lessons = [
  { title: 'گسسته', image: '/images/discrete.jpg', files: ['جزوه فصل اول', 'جزوه فصل دوم'] },
  { title: 'حسابان', image: '/images/calculus.jpg', files: ['فصل اول حسابان'] },
  { title: 'هندسه', image: '/images/geometry.jpg', files: ['فصل دوم هندسه'] },
  { title: 'آمار و احتمال', image: '/images/statistics.jpg', files: ['نمونه سوال آمار.pdf'] },
  { title: 'شیمی', image: '/images/chemistry.jpg', files: ['شیمی فصل اول.pdf'] }
];

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(null);

  const toggleLesson = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="resources-container p-4">

      {/* نوار جستجو */}
      <div className="search-bar-container">
        <div className="search-bar-resource">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="جستجوی درس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>


      {/* کارت‌های دروس */}
      <div className="d-flex gap-4 overflow-auto pb-3 flex-nowrap py-4">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson, index) => (
            <div
              key={index}
              className="lesson-card text-center"
              onClick={() => toggleLesson(index)}
            >
              <img src={lesson.image} alt={lesson.title} className="lesson-img" />
              <h5 className="mt-2 lesson-title">{lesson.title}</h5>
              <button className="btn btn-outline-warning mt-2">مشاهده منابع</button>
            </div>
          ))
        ) : (
          <div className="text-white fw-bold">درسی با این عنوان پیدا نشد.</div>
        )}
      </div>

      {/* منابع */}
      {expanded !== null && filteredLessons[expanded] && (
        <div className="lesson-files mt-5">
          <h4 className="text-white fw-bold mb-3">{filteredLessons[expanded].title}</h4>
          <ul className="list-group rounded">
            {filteredLessons[expanded].files.map((file, i) => (
              <li
                key={i}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  i % 2 === 0 ? 'bg-yellow' : 'bg-blue text-white'
                }`}
              >
                {file}
                <button className="btn btn-dark btn-sm">
                  <FaDownload />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
