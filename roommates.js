const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const newRoommate = async () => {
  try {
    const { data } = await axios.get('https://randomuser.me/api')
    const roommateData = data.results[0]
    const roommate = {
      id: uuidv4().slice(30),
      email: roommateData.email,
      nombre: `${roommateData.name.first} ${roommateData.name.last}`,
      debe: 0,
      recibe: 0
    }
    return roommate
  } catch (err) {
    throw err
  }
}

const saveRoommate = roommate => {
  const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'))
  roommatesJSON.roommates.push(roommate)
  fs.writeFileSync('roommates.json', JSON.stringify(roommatesJSON))
}

module.exports = { newRoommate, saveRoommate }