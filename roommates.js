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

// Realiza calculo de que debe y que debe recibir de cada roommate
// Se considera que cada gasto debe dividirse entre los roommates
const calcRMDebs = (spending) => {    
  const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'))
  const roommate = spending.roommate
  const roommates = roommatesJSON.roommates.length
  const amount = Math.round(spending.monto / roommates)
  
  // Solo tiene sentido compartir gastos si hay más de un roommate, no?
  if (roommates > 1) {
    roommatesJSON.roommates.forEach(rm => {
      rm.nombre == roommate
        ? rm.recibe += (spending.monto - amount) // Quien realiza el gasto debe recibir el total de lo gastado menos su parte
        : rm.debe += amount
    })
  
    fs.writeFileSync('roommates.json', JSON.stringify(roommatesJSON))
  }
}

module.exports = { newRoommate, saveRoommate, calcRMDebs }