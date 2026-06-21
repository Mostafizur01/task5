import MidiWriter from 'midi-writer-js'

function createMidiWriter(seed) {
    const track = new MidiWriter.Track()
    
    const getNote = (s) => {
        const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
        return notes[s % notes.length]
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

export default createMidiWriter