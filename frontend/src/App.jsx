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
      {data.map((item) => (
        <React.Fragment key={item.id}>
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
                  <h4>Lyrics:</h4>
                  <p>{item.text}</p>
                  <audio controls src={`https://task5-backend-y7lw.onrender.com/api/download?seed=${item.id}`}></audio>
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
    fetch(`https://task5-backend-y7lw.onrender.com/api/data?seed=${seed}&page=${page}&lang=${lang}`)
      .then(res => res.json())
      .then(newData => {
        setData(prev => (page === 1 ? newData : [...prev, ...newData]))
        setLoading(false);
      })
      .catch(error => {
        console.log('the error is: ', error)
        setLoading(false)
      })
  }, [page, seed, lang])


  if (loading) return <div className='loading'>Loading...</div>
  if (!data) return <div>Data not found</div>

  const toggleRow = (id) => {
    setRowId(rowId === id ? null : id)
  }
  const fetchMoreData = () => {
    setPage(prev => prev + 1)
  }

  return (
    <>
      <div>
        <div>
          <label>Seed: </label>
          <input
            type="number"
            value={seed}
            onChange={(e) => { setSeed(e.target.value); setPage(1); setData([]); }}
          />
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

      <table className="music-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Song</th>
            <th>Artist</th>
            <th>Likes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <React.Fragment key={item.id}>
              <tr onClick={() => toggleRow(item.id)}>
                <td>{item.id - 1}.</td>
                <td>{item.title}</td>
                <td>{item.artist}</td>
                <td><StarRating likes={item.like} /></td>
              </tr>

              {rowId === item.id && (
                <tr className="expanded-row">
                  <td colSpan="4">
                    <div className="expanded-content">
                      <h4>Lyrics:</h4>
                      <p>{item.text}</p>
                      <audio controls src={`https://task5-backend-y7lw.onrender.com/api/download?seed=${item.id}`}></audio>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>

        <span style={{ margin: '0 15px', fontWeight: 'bold' }}>Page {page}</span>

        <button className="page-btn" onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </>
  );
}

export default App;