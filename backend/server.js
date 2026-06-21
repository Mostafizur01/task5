import express from 'express'
import cors from 'cors'
import fakeData from './function/fakeData.js'
import { createMidiWriter, createNotes } from './function/midiWriter.js'

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
const port = process.env.PORT || 3000

app.get('/api/data', (req, res) => {
    try {
        const { seed, page, lang } = req.query

        const allData = fakeData(seed || 1, page || 1, lang || 'en')
        res.json(allData)
    } catch (error) {
        console.log(error)
        res.status(202).send('data error')
    }
})

app.get('/api/download', (req, res) => {
    try {
        const { seed } = req.query
        const midiBase = createMidiWriter(seed) || 200
        res.setHeader('Content-type', "audio/midi")
        res.setHeader('Content-disposition', `attachment; filename=music_${seed || 'default'}.mid`)
        const buffer = Buffer.from(midiBase, 'base64')
        return res.send(buffer)
    } catch (error) {
        console.log(error)
        res.status(200).send('server error')
    }
})

app.get('/api/notes', (req, res) => {
    try {
        const { seed, duration } = req.query
        const total = Number(duration) || 4
        const notes = createNotes(seed || 1, total)
        res.json({ notes, instrument: 'acoustic_grand_piano', total })
    } catch (error) {
        console.log(error)
        res.status(500).send('notes error')
    }
})

app.listen(port, () => {
    console.log(`server run on: http://localhost:${port}`)
})