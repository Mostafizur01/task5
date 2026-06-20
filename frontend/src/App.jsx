import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import heroImg from './assets/hero.png'


function App() {
  const [data, setData] = useState(null)
  const [loding, setLoding] = useState(true)
  useEffect(() => {
    fetch('https://task5-backend-y7lw.onrender.com/api/data?seed=1&page=1')
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
  if (loding) return <div>loding.....</div>
  if (!data) return <div>Data not found</div>
  return (
    <>
      <div className="music-container">
    <table className="music-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Song</th>
          <th>Artist</th>
          <th>Album</th>
          <th>Genre</th>
          <th>Likes</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.title}</td>
            <td>{item.artist}</td>
            <td>{item.album}</td>
            <td>{item.genre}</td>
            <td>{item.like} ❤️</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

    </>
  )
}

export default App
