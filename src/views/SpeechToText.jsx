import useSpeechToText from 'react-hook-speech-to-text';
import { useState, useRef } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';


function SpeechToText() {

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
      console.log('✅ Odpowiedź z API:', data);
      speak({ text: `${data.message}`})
      return data;
    } catch (error) {
      console.error('❌ Błąd przy wysyłaniu do API:', error);
    }
  };
  

  
  //Speech Recognition
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

  return (
    <>
      <div>
      <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <ul>
        <h2>Final</h2>
        {results.map((result) => (
          // !result.isFinal ? <li key={result.timestamp}>{result.transcript}</li> : ''
          !result.isFinal ? checkSpeech(result.transcript)  : ''
        ))}
        {results.map((result) => (
          !result.isFinal ? <li key={result.timestamp}>{result.transcript}</li> : ''
        ))}
        <h2>Nie final</h2>
        {results.map((result) => (
          result.isFinal ? <li key={result.timestamp}>{result.transcript}</li> : ''
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul>
    </div>
      
      
    </>
  )
}

export default SpeechToText