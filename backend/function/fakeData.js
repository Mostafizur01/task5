import { fakerEN, fakerJA } from '@faker-js/faker'

function genaretMusicData (userSeed, page, lang) {
    
    let vasha;
    if (lang  === 'ja') vasha = fakerJA
    else vasha   = fakerEN


    const seedValue = parseInt(userSeed) + parseInt(page)
    vasha.seed(seedValue)

    const fakeData = []
    const count = vasha.number.int({ min: 50, max: 100 })
    for (let i = 1; i <= count; i++) {
        const musicId = (parseInt(page) - 1) * 100 + i
        fakeData.push({
            id: musicId,
            title: vasha.music.songName(),
            artist: vasha.person.fullName(),
            album: vasha.music.album(),
            genre: vasha.music.genre(),
            like: vasha.number.int({ min: 0, max: 2000 }),
            text: vasha.lorem.paragraphs(2),
            duration: `${Math.floor(Math.random() * 4)} : ${Math.floor(Math.random() * 60)}`,
            imageUrl: `https://picsum.photos/seed/${musicId}/300/300`
        })
    }
    return fakeData
}

export default genaretMusicData