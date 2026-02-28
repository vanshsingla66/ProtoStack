import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import '../App.css'
import LearningPlatform from './pages/LearningPlatform.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LearningPlatform />
    </>
  )
}

export default App
