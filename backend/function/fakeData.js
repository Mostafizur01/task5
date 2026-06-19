import { faker, fakerEN, fakerDE } from '@faker-js/faker'

function genaretMusicData (userSeed, page, lang) {
    
    let faker;
    if (lang  === 'de') faker = fakerDE
    else faker = fakerEN


    const seedValue = parseInt(userSeed) + parseInt(page)
    faker.seed(seedValue)

    const fakeData = []
    const count = faker.number.int({ min: 50, max: 100 })
    for (let i = 1; i <= count; i++) {
        fakeData.push({
            id: i + 1,
            title: faker.music.songName(),
            artist: faker.person.fullName(),
            album: faker.music.album(),
            genre: faker.music.genre()
        })
    }
    return fakeData
}

export default genaretMusicData