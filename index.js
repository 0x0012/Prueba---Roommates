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
      res.setHeader('content-type', 'text/html')
      res.end(fs.readFileSync('index.html', 'utf8'))
    }
  
    if (req.url.startsWith('/roommate') && req.method == 'POST') {
      newRoommate()
        .then(async roommate => {
          saveRoommate(roommate)
          res.end(JSON.stringify(roommate))
        }) 
        .catch( err => {
          res.statusCode = 500
          res.end()
          console.log('ERROR: No se pudo crear el usuario -> ', err)
        })
    }
  
    if (req.url.startsWith('/roommates') && req.method == 'GET') {
      res.setHeader('content-type', 'application/json')
      res.end(fs.readFileSync('roommates.json', 'utf8'))
    }
  })
  .listen(3000, () => console.log('✅ SERVER ON : http://localhost:3000/'))