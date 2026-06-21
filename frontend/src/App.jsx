import React, { useState, useEffect } from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'
import './App.css'
import GalleryView from './GalleryView'
import Soundfont from 'soundfont-player'

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
                      <SoundPlayer seed={item.id} durationString={item.duration} />
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

function SoundPlayer({ seed, durationString }) {
  const BACKEND = 'https://task5-backend-y7lw.onrender.com'
  const [isPlaying, setIsPlaying] = useState(false)
  const instrumentRef = React.useRef(null)
  const activeNotesRef = React.useRef([])
  const audioCtxRef = React.useRef(null)

  async function fetchNotes() {
    const seconds = parseDurationString(durationString)
    const res = await fetch(`${BACKEND}/api/notes?seed=${seed}&duration=${seconds}`)
    if (!res.ok) throw new Error('notes fetch failed')
    return res.json()
  }

  function parseDurationString(s) {
    if (!s) return 4
    const cleaned = String(s).trim()
    const parts = cleaned.split(':').map(p => p.trim())
    if (parts.length === 2) {
      const m = Number(parts[0]) || 0
      const sec = Number(parts[1]) || 0
      return m * 60 + sec
    }
    const alt = cleaned.split(' : ').map(p => p.trim())
    if (alt.length === 2) return (Number(alt[0]) || 0) * 60 + (Number(alt[1]) || 0)
    const num = Number(cleaned)
    return Number.isFinite(num) ? num : 4
  }

  async function handlePlay() {
    if (isPlaying) return handleStop()
    try {
      const { notes, instrument } = await fetchNotes()
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      const ac = audioCtxRef.current
      const inst = await Soundfont.instrument(ac, instrument || 'acoustic_grand_piano')
      instrumentRef.current = inst
      activeNotesRef.current = []
      const start = ac.currentTime + 0.1
      notes.forEach(n => {
        const node = inst.play(n.pitch, start + (n.time || 0), { duration: n.duration || 0.5 })
        activeNotesRef.current.push(node)
      })
      setIsPlaying(true)
      const end = Math.max(...notes.map(n => (n.time || 0) + (n.duration || 0)))
      setTimeout(() => handleStop(), (end + 0.5) * 1000)
    } catch (err) {
      console.error(err)
    }
  }

  function handleStop() {
    activeNotesRef.current.forEach(n => { try { n.stop && n.stop() } catch (e) {} })
    activeNotesRef.current = []
    setIsPlaying(false)
  }

  function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels
    const length = buffer.length * numOfChan * 2 + 44
    const bufferArray = new ArrayBuffer(length)
    const view = new DataView(bufferArray)
    let offset = 0

    function writeString(s) {
      for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i))
      offset += s.length
    }

    writeString('RIFF')
    view.setUint32(offset, 36 + buffer.length * numOfChan * 2, true); offset += 4
    writeString('WAVE')
    writeString('fmt ')
    view.setUint32(offset, 16, true); offset += 4
    view.setUint16(offset, 1, true); offset += 2
    view.setUint16(offset, numOfChan, true); offset += 2
    view.setUint32(offset, buffer.sampleRate, true); offset += 4
    view.setUint32(offset, buffer.sampleRate * numOfChan * 2, true); offset += 4
    view.setUint16(offset, numOfChan * 2, true); offset += 2
    view.setUint16(offset, 16, true); offset += 2
    writeString('data')
    view.setUint32(offset, buffer.length * numOfChan * 2, true); offset += 4

    const channels = []
    for (let i = 0; i < numOfChan; i++) channels.push(buffer.getChannelData(i))
    let pos = 0
    while (pos < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][pos]))
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
        offset += 2
      }
      pos++
    }

    return new Blob([view], { type: 'audio/wav' })
  }

  async function handleDownload() {
    try {
      const { notes, instrument } = await fetchNotes()
      const end = Math.max(...notes.map(n => (n.time || 0) + (n.duration || 0)))
      const sampleRate = 44100
      const offlineCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(2, Math.ceil((end + 1) * sampleRate), sampleRate)
      const inst = await Soundfont.instrument(offlineCtx, instrument || 'acoustic_grand_piano')
      const start = offlineCtx.currentTime + 0.01
      notes.forEach(n => {
        inst.play(n.pitch, start + (n.time || 0), { duration: n.duration || 0.5 })
      })
      const rendered = await offlineCtx.startRendering()
      const wavBlob = audioBufferToWav(rendered)
      const url = URL.createObjectURL(wavBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `song_${seed}.wav`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button onClick={handlePlay} style={{ padding: '6px 10px' }}>{isPlaying ? 'Stop' : 'Play'}</button>
      <button onClick={handleDownload} style={{ padding: '6px 10px' }}>Download WAV</button>
      <a href={`https://task5-backend-y7lw.onrender.com/api/download?seed=${seed}`} download={`song_${seed}.mid`} style={{ fontSize: '12px', color: '#32cd32' }}>Download MIDI</a>
    </div>
  )
}

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [rowId, setRowId] = useState(null)
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('table')
  const [seed, setSeed] = useState(1)
  const [lang, setLang] = useState('en')
  const appendRef = React.useRef(false)

  useEffect(() => {
    setLoading(true)
    fetch(`https://task5-backend-y7lw.onrender.com/api/data?seed=${seed}&page=${page}&lang=${lang}`)
      .then(res => res.json())
      .then(newData => {
        setData(prev => appendRef.current && page > 1 ? [...prev, ...newData] : newData)
        appendRef.current = false
        setLoading(false)
      })
      .catch(error => {
        console.log('Error: ', error)
        appendRef.current = false
        setLoading(false)
      })
  }, [page, seed, lang])

  if (loading && page === 1) return <div className="loading"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>

  const toggleRow = (id) => setRowId(rowId === id ? null : id)
  const fetchMoreData = () => {
    appendRef.current = true
    setPage(prev => prev + 1)
  }

  const handlePreviousPage = () => {
    setPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setPage(prev => prev + 1)
  }

  return (
    <>
      <div className='toolbar'>
        <div>
          <label>Seed: </label>
          <input
            type="number"
            value={seed}
            onChange={(e) => { setSeed(Number(e.target.value) || 1); setPage(1); setData([]); }}
          />
        </div>
        <div>
          <label>Language: </label>
          <select onChange={(e) => { setLang(e.target.value); setPage(1); setData([]); }} value={lang}>
            <option value="en">English</option>
            <option value="ja">Japan</option>
          </select>
        </div>
        <button onClick={() => setViewMode('table')}>Table View</button>
        <button onClick={() => setViewMode('gallery')}>Gallery View</button>
        <div className='pagination-buttons'>
          <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
          <span>Page {page}</span>
          <button onClick={handleNextPage}>Next</button>
        </div>
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