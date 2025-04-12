import { useNavigate } from 'react-router-dom';
import './App.css'
import { BsArrow90DegLeft, BsArrowLeft, BsArrowRight } from "react-icons/bs";
function App() {
  const navigator = useNavigate()

  return (
    <div className='full'>
      <h1 className='welcome'>👋Witaj</h1>
      <p className='sub'>Pomogę ci w życiu codziennym. Możesz za pomocą polecenia głosowego powiedzieć mi co tylko chcesz, a odpowiem Ci na twoje pytania. 😊</p>
        <button onClick={() => navigator('/step2')} className='btn-icon'>Dalej<BsArrowRight style={{marginLeft: 20}}/></button>
    
    </div>
  )
}

export default App
