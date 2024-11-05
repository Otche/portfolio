import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import path from 'path'

const PORT = 5000
const mailServer = express()
mailServer.use(cors())
/**
 * mail server
 */
mailServer.post('/api/contact', (req, res) => {
  //const data = req.body
  console.log('test')
  //res.status(201).redirect('/data-form.html')
  res.sendFile(path.resolve('site/en/data-form.html'))
})
mailServer.get('/api/test', (req, res) => {
  //const data = req.body
  console.log('test')
  res.status(201).redirect('/career.html')
})

// mailServer.get('*', (req, res) => {
//   //const data = req.body
//   console.log('URL' + req.url)
//   //res.status(201).redirect('/data-form.html')
//   res.send('=====\n')
// })

mailServer.listen(PORT, () => {
  console.log('listen on  5000')
})

export function sendMail() {
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
