import React, { useState, useEffect } from 'react';
import { BsBellFill, BsClock, BsCalendarEvent, BsGearFill, BsMicFill, BsHouseFill } from 'react-icons/bs';
import './Notyfications.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Notyfications() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true); // Start loading
    fetch('https://backend-eli-iota.vercel.app/reminder')
      .then(res => res.json())
      .then(data => {
        setReminders(data);
        setLoading(false); // End loading
      })
      .catch(err => {
        console.error('Error fetching reminders:', err);
        setLoading(false); // End loading even on error
      });
  }, []);

  return (
    <div className="notyfications-container">
      <div className="main-content">
        <header className="notyfications-header">
          <BsCalendarEvent className="header-icon" />
          <h1 className="page-title">Twoje Przypomnienia</h1>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Ładowanie przypomnień...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="empty-state">
            <BsBellFill className="empty-icon" />
            <p className="empty-text">Brak aktywnych przypomnień</p>
          </div>
        ) : (
          <div className="reminders-grid">
            {reminders.map((reminder) => {
                const time = new Date(reminder.setTo).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC',
                  });
  

              return (
                <div key={reminder._id} className="reminder-card">
                  <div className="card-header">
                    <BsBellFill className="reminder-icon" />
                    <h3 className="reminder-title" style={{ fontSize: 22 }}>{reminder.reminder}</h3>
                  </div>
                  <div className="card-footer" style={{ fontFamily: 'Arial' }}>
                    <BsClock className="time-icon" style={{ fontSize: 50, marginRight: 20 }} />
                    <span className="reminder-time" style={{ fontSize: 50 }}>{time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <div className="nav-item active">
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
        <div className="nav-item" onClick={() => nav('/more')}>
          <BsGearFill className="nav-icon" />
          <span className="nav-label">Więcej</span>
        </div>
      </nav>
    </div>
  );
}
