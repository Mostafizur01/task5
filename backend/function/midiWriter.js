import midiWriter from 'midi-writer-js'

function createMidiWriter (seed) {
    const track = new MidiWriter.Track()
    track.addEvent(new MidiWriter.NoteEvent({ pitch: ['C4', 'E4', 'G4'], duration: '4' }))
    const write = new MidiWriter.Writer(track)
    return write.base64()
}

export default createMidiWriter