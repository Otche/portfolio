import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import bodyParser from 'body-parser'

const PORT = 5000
const mailServer = express()
mailServer.use(cors())
mailServer.use(bodyParser.json()) // to support JSON-encoded bodies
mailServer.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
)
/**
 * mail server
 */
mailServer.post('/api/contact', (req, res) => {
  const data = req.body
  console.log(data)
  sendMail(
    data.firstname,
    data.lastname,
    data.email,
    data.phone,
    data.service,
    data.content
  )
  res.status(201).redirect(`/${data.lang}/data-form.html`)
  //res.status(200).send(req.body)
})

/*
body: {"lang":"fr","firstname":"test","lastname":"test","email":"test@gmail.com","phone":"0123456789","service":"Développement Mobile","content":"test"}
*/

// mailServer.get('/api/test', (req, res) => {
//   //const data = req.body
//   console.log('test')
//   res.status(201).redirect('/career.html')
// })

mailServer.get('*', (req, res) => {
  console.log('URL: ' + req.url)
  //res.status(201).redirect('/data-form.html')
  res.send('=====x========\n')
})

mailServer.listen(PORT, () => {
  console.log('listen on  5000')
})

export function sendMail(
  firstanme: string,
  lastname: string,
  email: string,
  phone: string,
  service: string,
  content: string
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'djerada.madjid@gmail.com',
      pass: 'pjdwylerxsvndvut',
    },
  })

  const mailOptions = {
    from: email,
    to: 'contact@amine-ouchiha.com',
    subject: service,
    html: `<div><h3 style="color: blue">${service}</h3>
                <p>${content}</p>
                <p><b>${firstanme} ${lastname}</b></br> 
                    <b>Tel:</b> ${phone}</br>
                    <b>Email:</b> <a href="mailto:${email}"> ${email}</a></p>
          </div>`,
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
