import MidiWriter from 'midi-writer-js'

function createMidiWriter(seed) {
    const track = new MidiWriter.Track()
    
    const getNote = (s) => {
        const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
        return notes[Number(s) % notes.length]
    };

    const note1 = getNote(seed);
    const note2 = getNote(seed * 2);
    const note3 = getNote(seed * 3);

    track.addEvent(new MidiWriter.NoteEvent({ 
        pitch: [note1, note2, note3], 
        duration: '4' 
    }));

    const write = new MidiWriter.Writer(track);
    return write.base64()
}

function createNotes(seed, totalSeconds = 4) {
    const getNote = (s) => {
        const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
        return notes[Number(s) % notes.length]
    }

    const n1 = getNote(seed)
    const n2 = getNote(seed * 2)
    const n3 = getNote(seed * 3)

    const pattern = [n1, n2, n3, n1]
    const noteCount = Math.max(1, Math.floor(totalSeconds / 0.5))
    const notes = []
    for (let i = 0; i < noteCount; i++) {
        const pitch = pattern[i % pattern.length]
        const time = (i * totalSeconds) / noteCount
        const duration = Math.min(1.0, totalSeconds / noteCount)
        notes.push({ pitch, duration, time })
    }

    return notes
}

export { createMidiWriter, createNotes }