import React, { useState } from "react";
import "./style/AdvisorSelector.css";

// Font Awesome import (for search icon)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const advisorsData = [
  {
    id: 1,
    name: "سارا محمدی",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    resume:
      "سارا محمدی با بیش از 10 سال تجربه در حوزه مشاوره مالی و سرمایه‌گذاری، به مشتریان خود کمک می‌کند تا بهترین تصمیمات را بگیرند.",
  },
  {
    id: 2,
    name: "علی رضایی",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    resume:
      "علی رضایی متخصص در مشاوره کسب و کار و راه‌اندازی استارتاپ‌ها، با سابقه موفق در پروژه‌های متعدد.",
  },
  {
    id: 3,
    name: "مریم حسینی",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    resume:
      "مریم حسینی با تمرکز بر توسعه فردی و مهارت‌های نرم، به افراد کمک می‌کند تا زندگی بهتر و متعادل‌تری داشته باشند.",
  },
  {
    id: 4,
    name: "حمید کریمی",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    resume:
      "حمید کریمی دارای تخصص در مشاوره حقوقی و راهنمایی در امور قراردادی و حقوقی است.",
  },
];

export default function AdvisorSelector() {
  const [searchTerm, setSearchTerm] = useState("");
  const [flippedIds, setFlippedIds] = useState([]);

  const handleFlip = (id) => {
    setFlippedIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleChatClick = (e, name) => {
    e.stopPropagation();
    alert(`شروع پیام‌رسانی با ${name}`);
  };

  const filteredAdvisors = advisorsData.filter((advisor) =>
    advisor.name.includes(searchTerm)
  );

  return (
    <>
      <div className="search-bar-wrapper">
        <div className="search-input-wrapper">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input
            type="search"
            placeholder="جستجوی مشاور..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="notice">
        برای دیدن رزومه هر مشاور بر روی آن کلیک کنید
    </div>

      <main className="cards-container">
        {filteredAdvisors.map((advisor) => (
          <div
            key={advisor.id}
            className={`card ${flippedIds.includes(advisor.id) ? "flipped" : ""}`}
            onClick={() => handleFlip(advisor.id)}
          >
            <div className="card-inner">
              <div className="card-front">
                <img src={advisor.image} alt={advisor.name} />
                <h3>{advisor.name}</h3>
                <button
                  className="chat-btn"
                  onClick={(e) => handleChatClick(e, advisor.name)}
                >
                  پیام‌رسانی
                </button>
              </div>
              <div className="card-back">
                <h4>رزومه</h4>
                <p>{advisor.resume}</p>
              </div>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
