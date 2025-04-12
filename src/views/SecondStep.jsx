import React from 'react'
import { useState } from 'react'
import { Bs0Circle, BsCaretRight, BsCaretRightFill, BsChatHeart } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
export default function SecondStep() {
    const [fontSize, setFontSize] = useState('text-base')
    const navigator = useNavigate()
    return (
        <div className={`full`}>
            <h1 className={`welcome`}>Zanim zaczniemy</h1>
            <p className="text-center text-2xl m-4">Ustaw wielkość liter</p>
    
            <div className="flex flex-wrap justify-center">
              <button
                onClick={() => setFontSize('text-base')}
                className={`btn-icon text-base  ${
                  fontSize === 'text-base' ? 'bg-blue-500 border-blue-800 text-white' : ''
                }`}
              >
                <BsChatHeart style={{marginRight: 20}}/> Mały
              </button>
              <button
                onClick={() => setFontSize('text-xl')}
                className={`btn-icon  text-xl ${
                  fontSize === 'text-xl' ? 'bg-blue-500 border-blue-800 text-white' : ''
                }`}
              >
               <BsChatHeart style={{marginRight: 20}}/> Średni
              </button>
              <button
                onClick={() => setFontSize('text-2xl')}
                className={`btn-icon  ${
                  fontSize === 'text-2xl' ? 'bg-blue-500 border-blue-800 text-white' : ''
                }`}
              >
                <BsChatHeart style={{marginRight: 20}}/> Duży
              </button>
            </div>
    
            {/* Przykładowy tekst z dynamiczną wielkością */}
            <p className={`text-center mt-8 ${fontSize}`}>
              To jest tekst z aktualnie wybraną wielkością liter.
            </p>
    
          <button onClick={() => navigator('/main')} className="btn-icon border-blue-900 text-white p-2 rounded-xl bg-blue-600 text-2xl border-2 border-solid">
            <BsCaretRightFill style={{marginRight: 20}}/> Zaczynajmy
          </button>
        </div>
      )
}
