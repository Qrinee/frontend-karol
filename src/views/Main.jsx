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
    const [apiResponses, setApiResponses] = useState([]);
    const { speak } = useSpeechSynthesis();
    const [showReminderAnimation, setShowReminderAnimation] = useState(false);
    const [reminderContent, setReminderContent] = useState('');

    const [showConfirmationAnimation, setShowConfirmationAnimation] = useState(false);
const [confirmationContent, setConfirmationContent] = useState('');
    const checkSpeech = (speech) =>{
      // console.log("test: " + speech);
      const cleanedSpeech = speech.trim().toLowerCase();
  
      if (/\bkarol\b/i.test(cleanedSpeech) && !spokenSentences.current.includes(cleanedSpeech)) {
        console.log('✅ Nowe zdanie z "karol":', cleanedSpeech);
        spokenSentences.current.push(cleanedSpeech);
        console.log(JSON.stringify({ message: cleanedSpeech }));
        
        sendToApi(cleanedSpeech)
      }
    }



    const sendToApi = async (text) => {
        try {
          const response = await fetch('https://backend-eli-b7ds.vercel.app/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: text })
          });
      
          if (!response.ok) {
            throw new Error(`Błąd API: ${response.status}`);
          }
      
          const data = await response.json();

          // Zapisz wiadomość z backendu do logów
          if (data?.data?.message) {
            setApiResponses(prev => [...prev, `[KAROL]: ${data.data.message}`]);
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



  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: {
      lang: 'pl-PL',
      interimResults: true // Allows for displaying real-time speech results
    }
  });


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
  <span style={{fontWeight: 'bold'}}>Narzędzie demo teoretycznych sytuacji:</span>
  <p style={{fontSize: 20, color: 'gray'}}> (Nasze urządzenie reaguje na mowę, zalecny mikforon)</p>
  <button style={{backgroundColor: 'white', color: 'black', padding: 20, margin: 10, fontSize: 20}}>Wnuczek napisał wiadomość</button>
        <button style={{backgroundColor: 'white', color: 'black', padding: 20, margin: 10, fontSize: 20}}>Tryb alzheimer</button>
        <button style={{backgroundColor: 'white', color: 'black', padding: 20, margin: 10, fontSize: 20}}>Przypomnienie lekarstwo</button>
        <button style={{backgroundColor: 'white', color: 'black', padding: 20, margin: 10, fontSize: 20}}>Wezwanie pomocy</button>
        <button 
  style={{backgroundColor: 'white', color: 'black', padding: 20, margin: 10, fontSize: 20}}
  onClick={() => {
    setReminderContent("Testowe przypomnienie dodane!");
    setShowReminderAnimation(true);
    setTimeout(() => setShowReminderAnimation(false), 3000);
  }}
>
  Testuj animację
</button>
  {results.map((result) => (
    !result.isFinal ? checkSpeech(result.transcript) : ''
  ))}
  
  <div style={{height: "300px", overflowY: 'scroll'}} ref={scrollRef}>
    {results.map((result, index) => (
      !result.isFinal ? <div key={index} style={{fontSize: 20, fontFamily: 'Arial'}}>[TY]: {result.transcript}</div> : ''
    ))}
    {apiResponses.map((res, index) => (
      <div key={index} style={{ fontSize: 20, color: '#007700', fontFamily: 'Arial' }}>{res}</div>
    ))}
  </div>
</div>
    
      <div className="tell">



        <span key={currentText}>{currentText}</span>
      </div>
      <div className="w-full">
        <div className="main-part">
          <div className="container">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>


      <nav className="bottom-nav">
        <div className="nav-item" onClick={() => nav('/notyfications')}>
          <BsBellFill className="nav-icon" />
          <span className="nav-label">Przypomnienia</span>
        </div>
        {/* Nowy przycisk mikrofonu */}
        <div className={`mic-button-container ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}>
  <button className={`mic-button ${isRecording ? 'active' : ''}`}>
    <BsMicFill className="mic-icon" />
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
