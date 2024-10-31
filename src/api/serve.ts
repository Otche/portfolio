import express from 'express'
import nodemailer from 'nodemailer'

const PORT = 3000
const mailServer = express()

/**
 * mail server
 */
mailServer.post('/contact.html', (req, res) => {
  const data = 'req.body'
  console.log(data)
  res.status(201).send('Hello')
})

mailServer.listen(PORT, () => {
  console.log('listen on  3000')
})

function sendMail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'djerada.madjid@gmail.com',
      pass: 'pjdwylerxsvndvut',
    },
  })

  const mailOptions = {
    from: 'djerada.madjid@gmail.com',
    to: 'djermadjid@hotmail.fr',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

//sendMail()
