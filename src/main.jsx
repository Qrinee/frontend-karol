import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SecondStep from './views/SecondStep.jsx'
import Main from './views/Main.jsx'
import TextToSpeech from './views/TextToSpeech.jsx'
import Notyfications from './views/Notyfications.jsx'
import More from './views/More.jsx'
import SpeechToText from './views/SpeechToText.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/' element={<App />} />,
      <Route path='/step2' element={<SecondStep/>} />
      <Route path='/main' element={<Main/>} />
      <Route path='/stt' element={<SpeechToText/>} />
      <Route path='/txt' element={<TextToSpeech/>}/>
      <Route path='/notyfications' element={<Notyfications/>}/>
      <Route path='/more' element={<More/>} />
    </Routes>
  </Router>
,
)
