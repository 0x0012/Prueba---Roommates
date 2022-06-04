const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const { calcRMDebs } = require('./roommates')

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
  
  calcRMDebs(spending)
}

const updateSpending = newSpending => {
  const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'))
  
  // Revierte el gasto anterior
  const oldSpending = gastosJSON.gastos.find(s => s.id == newSpending.id)
  oldSpending.monto = -oldSpending.monto
  calcRMDebs(oldSpending)
  
  // Actualiza gasto
  gastosJSON.gastos.forEach(s => {
    if (s.id == newSpending.id) {
      s.roommate = newSpending.roommate
      s.descripcion = newSpending.descripcion
      s.monto = newSpending.monto
    }
  })
  fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON))
  calcRMDebs(newSpending)
}

const deleteSpending = id => {
  const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'))
  
  // Revierte gasto de roomates
  const spending = gastosJSON.gastos.find(s => s.id == id)
  spending.monto = -spending.monto
  calcRMDebs(spending)
  
  // Elimina gasto
  let newGastosJSON = { gastos: [] }  
  newGastosJSON.gastos = gastosJSON.gastos.filter(s => s.id != id)
  fs.writeFileSync('gastos.json', JSON.stringify(newGastosJSON))
}

module.exports = { addSpending, updateSpending, deleteSpending }