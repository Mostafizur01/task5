import express from 'express'
import cors from 'cors'
import fakeData from './function/fakeData.js'
import createMidiWriter from './function/midiWriter.js'

const app = express()
app.use(cors({ origin: 'http://localhost:5173/'}))
app.use(express.json())
const port = process.env.PORT || 3000

app.get('/api/data', (req, res) => {
    const { seed, page, lang } = req.query

    const allData = fakeData(seed || 1, page || 1, lang || 'en')
    res.json(allData)
})

app.get('/api/download', (req, res) => {
    const { seed } = req.query
    const midiBase = createMidiWriter(seed || 200)
    res.setHeader('Content-type', "audio/midi")
    res.setHeader('Content-disposition', `attachment; filename=music_${seed || 'default'}.mid`)
    const buffer = Buffer.from(midiBase, 'base64')
    return res.send(buffer)
})

app.listen(port, () => {
    console.log(`server run on: http://localhost:${port}`)
})