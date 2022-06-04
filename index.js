/*
 * Prueba - Roommates
 * @author Max Coronado Lorca
 */

const http = require('http')
const url = require('url')
const fs = require('fs')
const { newRoommate, saveRoommate } = require('./roommates')
const { addSpending, updateSpending } = require('./spendings')

http
  .createServer((req, res) => {
    
    // Devuelve el documento HTML atraves de la ruta GET / del servidor
    if (req.url == '/' && req.method == 'GET') {
      fs.readFile('index.html', 'utf8', (err, html) => {
        if (!err) {
          res.writeHead(200, { 'content-type': 'text/html'})
          res.end(html)
        } else {
          showERROR(res, 503, err)
        }
      })
    }
  
    // Crea y devuelve un nuevo roommate, desde la API randomuser.me
    if (req.url.startsWith('/roommate') && req.method == 'POST') {
      newRoommate()
        .then(async roommate => {
          saveRoommate(roommate)
          res.statusCode = 201
          res.end(JSON.stringify(roommate))
        }) 
        .catch( err => {
          showERROR(res, 500, err)
        })
    }
  
    // Devuelve todos los roommates desde archivo JSON
    if (req.url.startsWith('/roommates') && req.method == 'GET') { 
      fs.readFile('roommates.json', 'utf8', (err, json) => {
        if (!err) {
          res.writeHead(200, { 'content-type': 'application/json'})
          res.end(json)
        } else {
          showERROR(res, 503, err)
        }
      })
    }
  
    // Devuelve todos los gastos desde archivo JSON
    if (req.url.startsWith('/gastos') && req.method == 'GET') {
      fs.readFile('gastos.json', 'utf8', (err, json) => {
        if (!err) {
          res.writeHead(200, { 'content-type': 'application/json'})
          res.end(json)
        } else {
          showERROR(res, 503, err)
        }
      })
    }
  
    // Crea y procesa un nuevo gasto
    if (req.url.startsWith('/gasto') && req.method == 'POST') {
      let spending
      req.on('data', payload => spending = JSON.parse(payload))
      req.on('end', () => {
        if (spending.roommate != null) {
          addSpending(spending)
          res.statusCode = 201
          res.end()
        } else {
          showERROR(res, 400, 'ERROR: roommate is null')
        }
      })
    }
  
    // Procesa la edicion de un gasto
    if (req.url.startsWith('/gasto') && req.method == 'PUT') {
      const { id } = url.parse(req.url, true).query
      let spending
      req.on('data', payload => spending = JSON.parse(payload))
      req.on('end', () => {
        spending.id = id
        updateSpending(spending)
        res.statusCode = 201
        res.end()
      })
    }
  })
  .listen(3000, () => console.log('✅ SERVER ON : http://localhost:3000/'))

// Devuelve un mensaje de error especificado tanto al cliente como a la consola del servidor
const showERROR = (res, code, err) => {
  const _ERROR = {
    503: {
      html: '<h1>ERROR :(</h1><h2>Codigo 503</h2>No se pudo obtener el recurso solicitado.',
      text: 'ERROR: No se pudo obtener el recurso solicitado -> '
    },
    500: {
      html: '<h1>ERROR :(</h1><h2>Codigo 500</h2>No se pudo crear el elemento.',
      text: 'ERROR: No se pudo crear el elemento -> '
    },
    400: {
      html: '<h1>ERROR :(</h1><h2>Codigo 400</h2>La peticion contiene un error.',
      text: 'ERROR: La peticion contiene un error -> '
    }
  }
  
    res.writeHead(code, { 'content-type': 'text/html'})
    res.end(_ERROR[code].html)
    console.log(_ERROR[code].text, err)
}

