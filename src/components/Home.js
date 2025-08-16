import React from 'react';
import './style/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";


import {
  faSignInAlt,
  faGraduationCap,
  faBook,
  faPencilAlt,
  faEnvelope,
  faPhone,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';

import {
  faInstagram,
  faTelegram,
  faTwitter,
  faLinkedin,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

function Home() {

  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const faqData = [
    {
      question: 'مزایای مشاوره تحصیلی آنلاین چیست؟',
      answer: 'امکان دسترسی آسان، صرفه‌جویی در زمان و هزینه و مشاوره با بهترین مشاوران بدون محدودیت جغرافیایی.'
    },
    {
      question: 'مشاوره تحصیلی آنلاین بهتر است یا حضوری؟',
      answer: 'هر دو مزایای خاص خود را دارند، اما مشاوره آنلاین انعطاف‌پذیری بیشتری دارد.'
    },
    {
      question: 'مشاوره تحصیلی آنلاین چه کمکی به ما میکند؟',
      answer: 'در انتخاب رشته، برنامه‌ریزی درسی، کنترل استرس و مدیریت زمان کمک می‌کند.'
    },
    {
      question: 'نقش مشاور در آمادگی برای آزمون‌های مهم چیست؟',
      answer: 'مشاور با برنامه‌ریزی دقیق، انگیزه‌دهی و تحلیل عملکرد در آمادگی بیشتر نقش مؤثری دارد.'
    },
  ];
  


  return (
    <div className="home text-white">
      {/* Header */}
      <nav className="navbar px-3">
        <div className="container-fluid d-flex justify-content-between">
          <Link className="navbar-brand text-white" to="/">رهپو</Link>

          <ul className="nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">صفحه اصلی</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/AboutUs">درباره ما</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/Rules">قوانین و مقررات</Link>
            </li>
          </ul>

          <div>
            <button className="btn btn-outline-light mx-2" onClick={handleGoToLogin}>
              <FontAwesomeIcon icon={faSignInAlt} />
            </button>
          </div>
        </div>
      </nav>

      {/* Banner */}
      <div className="banner text-center text-black">
        <div className="banner-content"  onClick={handleGoToLogin}>
          <h2>موفقیت های بزرگ حاصل گام های کوچک است...</h2>
          <button className="btn btn-yellow mt-2">بریم تو کارش</button>
        </div>
      </div>

      {/* حوزه‌های تخصصی */}
      <div className="container my-5">
        <h5 className="text-center mb-4">حوزه‌های تخصصی</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card bg-blue text-white h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">
                    <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                    دانشگاه 
                  </h5>
                  <p className="card-text">از انتخاب رشته و مسیر شغلی تا مدیریت زمان و منابع در دوران دانشجویی، اینجا هستیم تا بهترین راهکارها رو بهت بدیم. مشاوران ما همراهت هستن تا تجربه دانشگاهی پربارتر و هدفمندتری داشته باشی.</p>
                </div>
                <a href="university.html" className="text-yellow text-decoration-none mt-3">مشاوران</a>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-blue text-white h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">
                    <FontAwesomeIcon icon={faBook} className="me-2" />
                    مدرسه 
                  </h5>
                  <p className="card-text">اینجا همراه همیشگی دانش‌آموزان هستیم! از برنامه‌ریزی درسی تا رفع اشکال دروس، معرفی منابع کمک‌درسی و راهنمایی برای پیشرفت تحصیلی. با مشاوران ما می‌تونی مسیر موفقیتت رو از همین حالا شروع کنی.</p>
                </div>
                <a href="highschool.html" className="text-yellow text-decoration-none mt-3">مشاوران</a>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-blue text-white h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    کنکور 
                  </h5>
                  <p className="card-text">کنکور یک مسیر پرچالش اما قابل فتحه! اینجا برنامه‌ریزی دقیق، مشاوره انگیزشی، تحلیل آزمون‌ها و معرفی بهترین منابع رو در اختیارت می‌ذاریم تا بتونی با آرامش و آمادگی کامل به هدفت برسی.</p>
                </div>
                <a href="preschool.html" className="text-yellow text-decoration-none mt-3">مشاوران</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* سوالات متداول */}
      <div className="container my-5">
        <h5 className="text-center mb-4">سوالات متداول</h5>
  
        <div className="accordion" id="faqAccordion">
          {faqData.map((item, index) => (
            <div className="accordion-item bg-blue text-white" key={index}>
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed bg-blue text-white"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq${index}`}
                >
                  {item.question}
                </button>
              </h2>
              <div
                id={`faq${index}`}
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="container my-5">
        <h5 className="text-center mb-4">نظرات کاربران</h5>
        <div className="scroll-horizontal">
          <div className="scroll-track">
            {[...Array(10)].map((_, i) => (
              <div className="card bg-blue text-white d-inline-block mx-2" key={`1-${i}`}>
                <div className="card-body">نظر کاربر {i + 1}</div>
              </div>
            ))}
            {[...Array(10)].map((_, i) => (
              <div className="card bg-blue text-white d-inline-block mx-2" key={`2-${i}`}>
                <div className="card-body">نظر کاربر {i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <footer className="bg-blue text-light pt-5 footer-custom">
        <div className="container">
          <div className="row text-center">

            <div className="col-md-3 mb-4 mx-auto">
              <h5 className="fw-bold d-flex flex-column align-items-center">
                <img src="/rahpoo-logo.png" alt="لوگوی رهپو" className="footer-logo mb-2" />
              </h5>
              {/* <p className="small"> همراه مطمئن شما در مسیر <br/> مشاوره تحصیلی و رشد فردی.</p> */}
            </div>

            <div className="col-md-3 mb-4 mx-auto">
              <h6 className="fw-bold mb-3">لینک‌های مفید</h6>
              <ul className="list-unstyled small">
                <li><a href="#" className="footer-link">صفحه اصلی</a></li>
                <li><a href="#" className="footer-link">مشاوران</a></li>
                <li><a href="#" className="footer-link">درباره ما</a></li>
                <li><a href="#" className="footer-link">قوانین و مقررات</a></li>
              </ul>
            </div>

            <div className="col-md-3 mb-4 mx-auto">
              <h6 className="fw-bold mb-3">ارتباط با ما</h6>
              <p className="small mb-1">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                info@rahpoo.ir
              </p>
              <p className="small">
                <FontAwesomeIcon icon={faPhone} className="me-2" />
                011-12345678
              </p>
            </div>


            <div className="col-md-3 mb-4 mx-auto">
              <h6 className="fw-bold mb-3">دنبال کنید</h6>
              <div className="d-flex flex-column align-items-center gap-2 fs-6">
                <a href="#" className="footer-link d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faInstagram} /> اینستاگرام
                </a>
                <a href="#" className="footer-link d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faTelegram} /> تلگرام
                </a>
                <a href="#" className="footer-link d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faTwitter} /> توییتر
                </a>
                <a href="#" className="footer-link d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faLinkedin} /> لینکدین
                </a>
                <a href="#" className="footer-link d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faGithub} /> گیت‌هاب
                </a>
              </div>
            </div>

          </div>

          <div className="text-center border-top border-light pt-3 mt-3 small">
            © 2025 رهپو | تمامی حقوق محفوظ است.
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;
