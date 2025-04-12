import React from 'react';
import { 
  BsBellFill, 
  BsGearFill, 
  BsHouseFill, 
  BsCalendarEvent,
  BsActivity,
  BsEmojiFrown,
  BsLightbulb,
  BsBrilliance,
  BsStarFill
} from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import './Notyfications.css';
import img from '../assets/img.jpg';

export default function More() {
  const nav = useNavigate();

  const conditions = [
    {
      title: "Choroba Alzheimera",
      icon: <BsBrilliance className="condition-icon" />,
      description: [
        "🔹 Analiza tonu głosu i wykrywanie niepokoju",
        "🔹 Terapia wspomnień z ulubioną muzyką",
        "🔹 Ćwiczenia pamięciowe i quizy"
      ],
      price: "19,99 zł/miesięcznie"
    },
    {
      title: "Choroba Parkinsona",
      icon: <BsActivity className="condition-icon" />,
      description: [
        "🔹 Monitorowanie drżenia głosu",
        "🔹 Ćwiczenia ruchowe wideo",
        "🔹 Motywacja do aktywności"
      ],
      price: "17,99 zł/miesięcznie"
    },
    {
      title: "Wsparcie przy depresji",
      icon: <BsEmojiFrown className="condition-icon" />,
      description: [
        "🔹 Codzienne check-iny emocjonalne",
        "🔹 Techniki relaksacyjne",
        "🔹 Łączenie z bliskimi"
      ],
      price: "14,99 zł/miesięcznie"
    },
    {
      title: "Wsparcie przy demencji",
      icon: <BsLightbulb className="condition-icon" />,
      description: [
        "🔹 Asystent dnia codziennego",
        "🔹 Powiadomienia dla opiekunów",
        "🔹 Ćwiczenia poznawcze",
        "🔹 Uproszczona nawigacja"
      ],
      price: "22,99 zł/miesięcznie"
    }
  ];

  const handlePurchase = (plan) => {
    alert(`Dziękujemy za wybór pakietu ${plan}! Przekierowujemy do płatności...`);
    // Tutaj logika płatności
  };

  return (
    <div className="notyfications-container senior-friendly">
      <div className="main-content">
        <header className="notyfications-header">
          <BsStarFill className="header-icon" style={{color: 'gold'}} />
          <h1 className="page-title">Funkcjonalności premium</h1>
          <p className="page-subtitle">Specjalne wsparcie dostosowane do Twoich potrzeb</p>
        </header>

        <div className="reminders-grid">
          {conditions.map((condition, index) => (
            <div className="reminder-card premium-card" key={index}>
              <div className="premium-badge">PREMIUM</div>
              <div className="card-header">
                {condition.icon}
                <h3 className="reminder-title">{condition.title}</h3>
              </div>
              <div className="card-content">
                <ul className="disease-list">
                  {condition.description.map((item, i) => (
                    <li key={i} className="disease-item">
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="price-container">
                  <span className="price"  style={{fontFamily: 'Arial'}}>{condition.price}</span>
                  <button 
                    className="purchase-button"
                    onClick={() => handlePurchase(condition.title)}
                  >
                    Aktywuj pakiet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <nav className="bottom-nav">
        <div className="nav-item" onClick={() => nav('/notyfications')}>
          <BsBellFill className="nav-icon" />
          <span className="nav-label">Przypomnienia</span>
        </div>
        
        <Link to={'/main'}>
          <div className="mic-button-container">
            <button className="mic-button">
              <BsHouseFill className="mic-icon" />
            </button>
          </div>
        </Link>
        
        <div className="nav-item active">
          <BsGearFill className="nav-icon" />
          <span className="nav-label">Więcej</span>
        </div>
      </nav>
    </div>
  );
}