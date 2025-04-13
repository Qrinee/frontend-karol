import React, { useState, useEffect, useRef } from 'react';
import { BsBell, BsBellFill, BsGearFill, BsMicFill, BsMicrosoft } from 'react-icons/bs';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { Link, useNavigate } from 'react-router-dom';
import './Notyfications.css';
import { useSpeechSynthesis } from 'react-speech-kit';
import useSpeechToText from 'react-hook-speech-to-text';

const texts = ["Karol, Przypomnij o tabletkach o ósmej", "Karol, co miałam dzisiaj zrobic?", "Karol, jak podłączyć dekoder?", "Karol, o której są msze w Niedzielę?", "Karol, pokaż co wysłał Kamil"];

export default function Main() {
    
    const spokenSentences = useRef([]); 
    const [isKarolSpeaking, setIsKarolSpeaking] = useState(false);
    const { speak } = useSpeechSynthesis();
    const [showReminderAnimation, setShowReminderAnimation] = useState(false);
    const [reminderContent, setReminderContent] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [showConfirmationAnimation, setShowConfirmationAnimation] = useState(false);
const [confirmationContent, setConfirmationContent] = useState('');
    const [reminders, setReminders] = useState([])

    const eatingReminder = ["9:00", "18:07", "18:30"]; //Godziny w których asystent ma przypomnieć o jedzeniu
const drinkingReminder = ["10:00", "12:00","18:24","16:00", "18:00", "01:48"]; //Godziny w których asystent ma przypomnieć o piciu
const checkSpeech = (speech) => {
  const cleanedSpeech = speech.trim().toLowerCase();
  if (/\bkarol\b/i.test(cleanedSpeech) && !spokenSentences.current.includes(cleanedSpeech)) {
      spokenSentences.current.push(cleanedSpeech);
      sendToApi(cleanedSpeech);
  }
};

const {
  interimResult,
  isRecording,
  results,
  startSpeechToText,
  stopSpeechToText,
} = useSpeechToText({
  continuous: navigator.userAgent.match('/Mobile/') ? false : true,
  useLegacyResults: false,
  timeout: navigator.userAgent.match('/Mobile/') ? 5000 : 3000,
  speechRecognitionProperties: {
    lang: 'pl-PL',
    interimResults: navigator.userAgent.ma // Allows for displaying real-time speech results
  }
});

useEffect(() => {
  const newFinalResults = results.filter(result => result.isFinal && !result.processed);
  newFinalResults.forEach(result => {
      result.processed = true; // Oznacz jako przetworzone
      setChatHistory(prev => [...prev, { type: 'user', content: result.transcript }]);
  });
}, [results]);
    const sendToApi = async (text) => {
        try {
            const response = await fetch('https://backend-eli-b7ds.vercel.app/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            // Dodaj odpowiedź Karola do historii
            if (data?.data?.message) {
              setChatHistory(prev => [...prev, { 
                  type: 'karol', 
                  content: data.data.message,
                  timestamp: new Date().toLocaleTimeString()
              }]);
          }
          console.log('✅ Odpowiedź z API:', data);
          
          // Obsługa dodawania przypomnienia
          if (data.data?.action === "addReminder") {
            setReminderContent(data.data.message || "Przypomnienie dodane!");
            setShowReminderAnimation(true);
            setTimeout(() => {
              setShowReminderAnimation(false);
            }, 3000);
          }
          
          // Obsługa potwierdzenia wykonania
          if (data.data?.action === "confirmDone") {
            setConfirmationContent(data.data.message || "Potwierdzono wykonanie!");
            setShowConfirmationAnimation(true);
            setTimeout(() => {
              setShowConfirmationAnimation(false);
            }, 3000);
          }
          
          speak({ text: `${data.data?.message || data.message}` });
          return data;
        } catch (error) {
          console.error('❌ Błąd przy wysyłaniu do API:', error);
        }
      };






  const [shouldRecord, setShouldRecord] = useState(false);
  
  if(!isRecording && shouldRecord){
    startSpeechToText();
  }

  const startSpeechRecognition = () => {
    setShouldRecord(true);
    startSpeechToText();
  }
  const stopSpeechRecognition = () => {
    setShouldRecord(false);
    stopSpeechToText();
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Sprawdzam kalendarz");

      fetch('https://backend-eli-b7ds.vercel.app/reminder')
        .then(response => response.json())
        .then(data => {
          setReminders(data)
          console.log("Otrzymane dane:", data);
        })
        .catch(error => {
          console.error("Błąd podczas pobierania danych:", error);
        });
        

    }, 50000); // co 1 sekunde

    return () => clearInterval(intervalId); // czyści interval przy odmontowaniu komponentu
  }, []);


  const triggeredTodayRef = useRef(new Set())
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5); // HH:mm
      const dateString = now.toDateString();
      const key = `${dateString}|${timeString}`;

      // jeżeli jeszcze nie wywołane
      if (!triggeredTodayRef.current.has(key)) {
        if (eatingReminder.includes(timeString)) {
          triggeredTodayRef.current.add(key);
          remindToEat(timeString);
        } else if (drinkingReminder.includes(timeString)) {
          triggeredTodayRef.current.add(key);
          remindToDrink(timeString);
        }
      }

      // czyszczenie przestarzałych wpisów
      for (let k of triggeredTodayRef.current) {
        if (!k.startsWith(dateString)) {
          triggeredTodayRef.current.delete(k);
        }
      }
    };

    const intervalId = setInterval(checkTime, 1000); // sprawdzaj co sekundę
    return () => clearInterval(intervalId);
  }, []);
  

  //Przypominanie o braniu leków
  useEffect(() => {
    const interval = setInterval(() => {
      speak({ text: ` `})
      const now = new Date();


      const updated = reminders.map((reminder) => {
        const reminderTime = new Date(reminder.setTo);

        const sameDay = reminderTime.toDateString() === now.toDateString();
        const sameMinute = reminderTime.getHours() === now.getHours() &&
                           reminderTime.getMinutes() === now.getMinutes();


        const hours = reminderTime.getHours().toString();
        const minutes = reminderTime.getMinutes();
        
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
        
        const godzina = hours + ':' + formattedMinutes;

        if (sameMinute && sameDay) {
          console.log(`Jest godzina ${godzina } : ${now.getMinutes}, ${reminder.reminder}`);
          speak({ text: `Jest godzina ${godzina}, ${reminder.reminder}`})
        }

        if (reminderTime < now && sameDay) {
          console.log(godzina);
          
          speak({ text: `Czy zażyłeś już? ${reminder.reminder}, który zażywasz o godzinie ${godzina}, jeśli już to zrobiłeś to potwierdź to głosowo` })
          
          console.log(`❗ Czy wziąłeś już lek: ${reminder.reminder}?`);
        }

        return reminder;
      });

      setReminders(updated);
    }, 10000);

    return () => clearInterval(interval);
  }, [reminders]);



  const remindToEat = (time) => {
    console.log(`Przypomnienie o jedzeniu! Godzina: ${time}`);
    speak({ text: 'Przypomnienie! Przypominam o porze na posiłek' })
  };

  const remindToDrink = (time) => {
    console.log(`Przypomnienie o piciu! Godzina: ${time}`);
    speak({ text: 'Przypomnienie! Przypominam o regularnym nawadnianiu' })
  };

  const [currentText, setCurrentText] = useState("Karol, przypomnij o tabletkach o ósmej");
  const nav = useNavigate()
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [results]);
  useEffect(() => {
    const interval = setInterval(() => {

      setCurrentText((prevText) => {
        const currentIndex = texts.indexOf(prevText);
        const nextIndex = (currentIndex + 1) % texts.length;
        return texts[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>

        {showReminderAnimation && (
  <div className="reminder-animation" style={{fontFamily: 'Arial'}}>
    <svg className="reminder-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle className="reminder-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
      <path className="reminder-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
    <div className="reminder-content">{reminderContent}</div>
  </div>
)}

{showConfirmationAnimation && (
      <div className="confirmation-animation" style={{fontFamily: 'Arial'}}>
        <svg className="confirmation-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="confirmation-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path className="confirmation-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <div className="reminder-content">{confirmationContent}</div>
      </div>
    )}

<div className='devtool'>
  <span style={{fontWeight: 'bold', fontSize: 'clamp(18px, 4vw, 30px)'}}>Narzędzie demo teoretycznych sytuacji:</span>
  <p style={{fontSize: 'clamp(14px, 3vw, 20px)', color: 'gray'}}> (Nasze urządzenie reaguje na mowę, zalecny mikforon)</p>
  
  <div style={{display: 'flex', flexDirection: window.innerWidth <= 800 ? 'column' : 'row', flexWrap: 'wrap'}}>
    <button style={{backgroundColor: 'white', color: 'black', padding: '15px', margin: '5px', fontSize: 'clamp(14px, 3vw, 20px)', flex: window.innerWidth <= 800 ? '1' : 'none'}}>
      Wnuczek napisał wiadomość
    </button>
    <button style={{backgroundColor: 'white', color: 'black', padding: '15px', margin: '5px', fontSize: 'clamp(14px, 3vw, 20px)', flex: window.innerWidth <= 800 ? '1' : 'none'}}>
      Tryb alzheimer
    </button>
    <button style={{backgroundColor: 'white', color: 'black', padding: '15px', margin: '5px', fontSize: 'clamp(14px, 3vw, 20px)', flex: window.innerWidth <= 800 ? '1' : 'none'}}>
      Przypomnienie lekarstwo
    </button>
    <button style={{backgroundColor: 'white', color: 'black', padding: '15px', margin: '5px', fontSize: 'clamp(14px, 3vw, 20px)', flex: window.innerWidth <= 800 ? '1' : 'none'}}>
      Wezwanie pomocy
    </button>
  </div>

  {results.map((result) => (
    !result.isFinal ? checkSpeech(result.transcript) : ''
  ))}
  
  <div style={{
    height: "300px",
    overflowY: 'scroll',
    fontSize: 'clamp(14px, 3vw, 20px)'
  }} ref={scrollRef}>
                    {chatHistory.map((entry, index) => (
                        <div 
                            key={index}
                            style={{
                                fontSize: 20,
                                fontFamily: 'Arial',
                                color: entry.type === 'user' ? '#2c3e50' : '#4a90e2',
                                margin: '10px 0',
                                padding: '10px',
                                borderRadius: '8px',
                                backgroundColor: entry.type === 'user' ? '#f0f4f8' : '#e3f2fd',
                                alignSelf: entry.type === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                wordBreak: 'break-word'
                            }}
                        >
                            <strong>{entry.type === 'user' ? '[TY]: ' : '[KAROL]: '}</strong>
                            {entry.content}
                            <div style={{
                                fontSize: '0.8em',
                                color: entry.type === 'user' ? '#7f8c8d' : '#5a90d1',
                                marginTop: '5px'
                            }}>
                                {entry.timestamp || new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                    {results.map((result, index) => (
                        !result.isFinal && (
                            <div 
                                key={`temp-${index}`}
                                style={{
                                    fontSize: 20,
                                    fontFamily: 'Arial',
                                    color: '#7f8c8d',
                                    fontStyle: 'italic',
                                    margin: '5px 0'
                                }}
                            >
                                [Rozpoznaję...]: {result.transcript}
                            </div>
                        )
                    ))}
                </div>
</div>
    
      <div className="tell">



        <span key={currentText}>{currentText}</span>
      </div>
      <div className="w-full">
        <div className="main-part">
          <div className={`container ${isRecording ? 'rec' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <BsMicFill className='xdd'   />
      <nav className="bottom-nav">
        <div className="nav-item" onClick={() => nav('/notyfications')}>
          <BsBellFill className="nav-icon" />
          <span className="nav-label">Przypomnienia</span>
        </div>
        {/* Nowy przycisk mikrofonu */}
        <div className={`mic-button-container ${isRecording ? 'recording' : ''}`} 
     onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}>
  <button className={`mic-button ${isRecording ? 'active' : ''}`}>
    <BsMicFill className="mic-icon"  />
  </button>
</div>
        <div className="nav-item" onClick={() => nav('/more')}>
          <BsGearFill className="nav-icon" />
          <span className="nav-label">Ustawienia</span>
        </div>
      </nav>
      </div>
    </div>
  );
}
