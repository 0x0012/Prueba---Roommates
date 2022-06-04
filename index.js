/*
 * Prueba - Roommates
 * @author Max Coronado Lorca
 */

const http = require('http')
const url = require('url')
const fs = require('fs')
const { newRoommate, saveRoommate } = require('./roommates')

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
          res.end(JSON.stringify(roommate))
        }) 
        .catch( err => {
          showERROR(res, 500, err)
        })
    }
  
    if (req.url.startsWith('/roommates') && req.method == 'GET') {
      res.setHeader('content-type', 'application/json')
      res.end(fs.readFileSync('roommates.json', 'utf8'))
    }
  
    if (req.url.startsWith('/gastos') && req.method == 'GET') {
      res.setHeader('content-type', 'application/json')
      res.end(fs.readFileSync('gastos.json', 'utf8'))
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
      html: '<h1>ERROR :(</h1><h2>Codigo 500</h2>No se pudo crear el Roommate.',
      text: 'ERROR: No se pudo crear el Roommate -> '
    }}
  
    res.writeHead(code, { 'content-type': 'text/html'})
    res.end(_ERROR[code].html)
    console.log(_ERROR[code].text, err)
}

