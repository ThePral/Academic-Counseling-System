import React, { useState } from "react";
import "./style/AdvisorSelection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faComments } from "@fortawesome/free-solid-svg-icons";

const advisors = [
    {
      id: 1,
      name: "دکتر سارا رضایی",
      image: "/images/advisor1.jpg",
      resume: "متخصص مشاوره تحصیلی با ۱۰ سال سابقه درخشان در زمینه کنکور و انتخاب رشته.",
    },
    {
      id: 2,
      name: "مهندس محمد امینی",
      image: "/images/advisor2.jpg",
      resume: "مشاور انگیزشی و برنامه‌ریز درسی، سابقه همکاری با مدارس برتر تهران.",
    },
    {
      id: 3,
      name: "مهندس پوریا علیزاده",
      image: "/images/advisor3.jpg",
      resume: "متخصص و کاردرست در زمینه کامپیوتر",
    },
    {
      id: 4,
      name: "مهندس سنا صادقی",
      image: "/images/advisor4.jpg",
      resume: "متخصص و کاردرست در زمینه دیزاین سایت",
    },
    {
      id: 5,
      name: "مهندس عسل سلیمی مجاوری",
      image: "/images/advisor5.jpg",
      resume: "متخصص و کاردرست در زمینه حمالی در بخش فرانت سایت",
    },
    {
      id: 6,
      name: "مهندس زهرا رضایی ",
      image: "/images/advisor6.jpg",
      resume: "متخصص در پایگاه داده و فارغ التخصیل از دانشگاه صنعتی نوشیروانی ",
    },
  
  ];
  

export default function AdvisorSelection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [flippedCard, setFlippedCard] = useState(null);

  const handleCardClick = (id) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  const filteredAdvisors = advisors.filter((advisor) =>
    advisor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="advisor-selection-page">
      <div className="search-bar-container">
        <div className="search-bar-advisor">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="جستجوی مشاور"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="advisor-cards">
        {filteredAdvisors.map((advisor) => (
          <div
            key={advisor.id}
            className={`advisor-card ${flippedCard === advisor.id ? "flipped" : ""}`}
            onClick={() => handleCardClick(advisor.id)}
          >
            <div className="card-front">
              <img src={advisor.image} alt={advisor.name} />
              <h4>{advisor.name}</h4>
              <p>برای مشاهده رزومه کلیک کنید</p>
              <button
                className="chat-button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  window.location.href = "/messages";
                }}
              >
                <FontAwesomeIcon icon={faComments} /> چت با مشاور
              </button>
            </div>
            <div className="card-back">
              <p>{advisor.resume}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
