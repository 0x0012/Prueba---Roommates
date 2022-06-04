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

const updateSpending = newSpending => {
  const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'))
  
  // Revertir gasto anterior
  const oldSpending = gastosJSON.gastos.find(s => s.id == newSpending.id)
  oldSpending.monto = -oldSpending.monto
  updateSpendings(oldSpending)
  
  // Actualiza gasto
  gastosJSON.gastos.forEach(s => {
    if (s.id == newSpending.id) {
      s.roommate = newSpending.roommate
      s.descripcion = newSpending.descripcion
      s.monto = newSpending.monto
    }
  })
  fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON))
  updateSpendings(newSpending)
}

module.exports = { addSpending, updateSpending }