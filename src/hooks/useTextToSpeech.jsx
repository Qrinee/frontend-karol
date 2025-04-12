import { useSpeechSynthesis } from 'react-speech-kit';

export function useTextToSpeech() {
  const { speak } = useSpeechSynthesis();

  // Function to speak the provided text
  const speakText = (text) => {
    speak({ text });
  };

  return { speakText };
}
