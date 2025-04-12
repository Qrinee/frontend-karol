
import { useEffect, useRef, useState } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit';

let initialReminders = [
  {
    "_id": "67fa8bf2516e9e6cb2d61711",
    "reminder": "Weź magnez z witaminą B6",
    "setTo": "2025-04-12T22:30:00.000Z",
    "createdAt": "2025-04-12T21:51:14.731Z",
  },

  {
    "_id": "67fa8c30516e9e6cb2d61713",
    "reminder": "Weź metforminę podczas kolacji",
    "setTo": "2025-04-12T22:00:00.000Z",
    "createdAt": "2025-04-12T21:52:30.000Z",
  },
  {
    "_id": "67fa8c50516e9e6cb2d61714",
    "reminder": "Weź amlodypinę przed śniadaniem",
    "setTo": "2025-04-12T22:00:00.000Z",
    "createdAt": "2025-04-12T21:53:00.000Z",
  }
]


const eatingReminder = ["9:00", "18:07", "18:30"]; 
const drinkingReminder = ["10:00", "12:00","18:24","16:00", "18:00", "20:30"]; 

function TextToSpeech() {
  const [reminders, setReminders] = useState(initialReminders);
  const [pendingReminders, setPendingReminders] = useState([]);

  //Kalendarz z serwera
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Sprawdzam kalendarz");

      fetch('http://localhost:3000/reminder')
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


  const { speak } = useSpeechSynthesis();


  //Przypominanie o rutynie z frontendu
  const triggeredTodayRef = useRef(new Set());

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

  const remindToEat = (time) => {
    console.log(`Przypomnienie o jedzeniu! Godzina: ${time}`);
    speak({ text: 'Przypomnienie! Przypominam o porze na posiłek' })
  };

  const remindToDrink = (time) => {
    console.log(`Przypomnienie o piciu! Godzina: ${time}`);
    speak({ text: 'Przypomnienie! Przypominam o regularnym nawadnianiu' })
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



  
  

  //Przypominanie o braniu leków
  useEffect(() => {
    const interval = setInterval(() => {
      speak({ text: ` `})
      const now = new Date();

      const updatedPending = [];

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
          console.log(`Jest godzina ${godzina } : ${now.getMinutes}, Pora na wzięcie leku, ${reminder.reminder}`);
          speak({ text: `Jest godzina ${godzina}, Pora na wzięcie leku, ${reminder.reminder}`})
          updatedPending.push(reminder);
        }

        if (reminderTime < now && sameDay) {
          console.log(godzina);
          
          speak({ text: `Czy zażyłeś już? ${reminder.reminder}, który zażywasz o godzinie ${godzina}, jeśli już to zrobiłeś to potwierdź to głosowo` })
          setTimeout(() => {
            speak({ text: `Czy zażyłeś już? ${reminder.reminder}, który zażywasz o godzinie ${godzina}, jeśli już to zrobiłeś to potwierdź to głosowo` });
          }, 1000); // 1000 ms = 1 sekunda
          
          console.log(`❗ Czy wziąłeś już lek: ${reminder.reminder}?`);
          updatedPending.push(reminder);
        }

        return reminder;
      });

      setPendingReminders(updatedPending);
      setReminders(updated);
    }, 10000);

    return () => clearInterval(interval);
  }, [reminders]);



  return (
    <>
      
      <div className="card">
        <button onClick={()  => speak({ text: 'Przypomnienie! Przypominam o porze na posiłek' })}>
          Test text to speech
        </button>
        
      </div>
      
    </>
  )
}

export default TextToSpeech
