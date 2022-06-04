const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const { updateSpendings } = require('./roommates')

const addSpending = (newSpending) => {
  const spending = {
    id: uuidv4().slice(30),
    roommate: newSpending.roommate,
    descripcion: newSpending.descripcion,
    monto: newSpending.monto
  }
  
  const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'))
  gastosJSON.gastos.push(spending)
  fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON))
  
  updateSpendings(spending)
}

module.exports = { addSpending }