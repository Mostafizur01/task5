import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import heroImg from './assets/hero.png'


function App() {
  const [data, setData] = useState(null)
  const [loding, setLoding] = useState(false)
  useEffect(() => {
    fetch('https://task5-backend-y7lw.onrender.com')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoding(false)
        console.log(data)
      })
      .catch(error => {
        console.log('the error is: ', error)
        setLoding(false)
      })
  }, [])
  return (
    <>
      
      
    </>
  )
}

export default App
