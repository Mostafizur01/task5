import React, { useState, useEffect } from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'
import './App.css'
import GalleryView from './GalleryView'

const StarRating = ({ likes }) => {
  const rating = Math.round((likes / 2000) * 5)
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? <FaStar color="#ffc107" size={14} /> : <FaRegStar color="#ffc107" size={14} />}
        </span>
      ))}
    </div>
  )
}

const TableView = ({ data, toggleRow, rowId }) => (
  <table className="music-table">
    <thead>
      <tr><th>#</th><th>Song</th><th>Artist</th><th>Likes</th></tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <React.Fragment key={`${item.id}-${index}`}>
          <tr onClick={() => toggleRow(item.id)}>
            <td>{item.id}</td>
            <td>{item.title}</td>
            <td>{item.artist}</td>
            <td><StarRating likes={item.like} /></td>
          </tr>
          {rowId === item.id && (
            <tr className="expanded-row">
              <td colSpan="4">
                <div className="expanded-content">
                  <img src={item.imageUrl} alt={item.title} className='image' />
                  <div>
                    <h4>Lyrics:</h4>
                    <p>{item.text}</p>

                    <div className="audio-player-container">
                      <audio
                        controls
                        src={`https://task5-backend-y7lw.onrender.com/api/download?seed=${item.id}`}
                        className='audio'
                      >
                        Your browser does not support the audio element.
                      </audio>

                      <a
                        href={`https://task5-backend-y7lw.onrender.com/api/download?seed=${item.id}`}
                        download={`song_${item.id}.mid`}
                        className="download-link"
                        style={{ display: 'block', marginTop: '5px', fontSize: '12px', color: '#32cd32' }}
                      >
                        Download MIDI file
                      </a>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
  </table>
)

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [rowId, setRowId] = useState(null)
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('table')
  const [seed, setSeed] = useState(1)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    setLoading(true)
    fetch(`https://task5-backend-y7lw.onrender.com/api/data?seed=${seed}&page=${page}&lang=${lang}`)
      .then(res => res.json())
      .then(newData => {
        setData(prev => (page === 1 ? newData : [...prev, ...newData]))
        setLoading(false)
      })
      .catch(error => {
        console.log('Error: ', error)
        setLoading(false)
      })
  }, [page, seed, lang])

  if (loading && page === 1) return <div className="loading"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>

  const toggleRow = (id) => setRowId(rowId === id ? null : id)
  const fetchMoreData = () => setPage(prev => prev + 1)

  return (
    <>
      <div className='toolbar'>
        <div>
          <label>Seed: </label>
          <input type="number" value={seed} onChange={(e) => { setSeed(e.target.value); setPage(1); setData([]); }} />
        </div>
        <div>
          <label>Language: </label>
          <select onChange={(e) => { setLang(e.target.value); setPage(1); setData([]); }}>
            <option value="en">English</option>
            <option value="ja">Japan</option>
          </select>
        </div>
        <button onClick={() => setViewMode('table')}>Table View</button>
        <button onClick={() => setViewMode('gallery')}>Gallery View</button>
      </div>

      {viewMode === 'table' ? (
        <TableView data={data} toggleRow={toggleRow} rowId={rowId} />
      ) : (
        <GalleryView data={data} fetchMoreData={fetchMoreData} hasMore={true} />
      )}
    </>
  )
}

export default App