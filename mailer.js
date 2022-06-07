// Uso del paquete nodemailer para el envio de correos
const nodemailer = require('nodemailer')
const fs = require('fs')

// Uso de credenciales para el envio de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jsfs.dev@gmail.com',
    pass: 'clave1234'
  }
})

// Definicion de remitente de correos
let mailOptions = {
  from: '"Roommates" <jsfs.dev@gmail.com>',
}

// Envia correos con parametros definidos
const sendMail = (to, subject, content) => {
  mailOptions['to'] = to
  mailOptions['subject'] = subject
  mailOptions['html'] = content
  
  return transporter.sendMail(mailOptions)
}

const email2roommates = spending => {
  const roommates = JSON.parse(fs.readFileSync('roommates.json', 'utf8'))
  const emails = roommates.roommates.map(r => r.email)
  emails.push('jsfs.dev@gmail.com')
  
  const content = `<p>Hola,</p><p><strong>${spending.roommate}</strong>, ha registrado un nuevo gasto: <strong>"${spending.descripcion}"</strong> por <strong>${spending.monto}</strong>.<br><p>Saludos</p>`
  
  sendMail(emails.toString(), 'Se ha registrado un nuevo gasto', content)
}

module.exports = { email2roommates }