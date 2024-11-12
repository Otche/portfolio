import express from 'express'
import fetch from 'node-fetch'

import nodemailer from 'nodemailer'
import cors from 'cors'
import bodyParser from 'body-parser'

const PORT = process.env.PORT || 5000
const mailServer = express()

mailServer.use(cors())
mailServer.use(bodyParser.json()) // to support JSON-encoded bodies
mailServer.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
)
type RESTOKENCAPTCHATYPE = {
  success: boolean
  challenge_ts: string
  hostname: string
  action: string
}

/**
 * mail server
 */

const captchaTokenVerif: (
  captchaToken: string,
  captchaPrivateKeyValue: string
) => Promise<RESTOKENCAPTCHATYPE> = async (
  captchaToken,
  captchaPrivateKeyValue
): Promise<RESTOKENCAPTCHATYPE> => {
  const res = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${captchaPrivateKeyValue}&response=${captchaToken}`,
    {
      method: 'POST',
    }
  )
  return (await res.json()) as Promise<RESTOKENCAPTCHATYPE>
}

mailServer.post('/api/contact', (req, res) => {
  const data = req.body
  const captchaPrivateKeyValue = process.env.PRIVATE_CAPTCHA_KEY
  if (!captchaPrivateKeyValue) {
    res.status(400).redirect(`/${data.lang}/contact.html`)
    throw new Error('Privete key parameter is empty !')
  }
  if (captchaPrivateKeyValue.length < 30) {
    res.status(400).redirect(`/${data.lang}/contact.html`)
    throw new Error('Your Privete key is not valid !')
  }
  const captchaToken = data['g-recaptcha-response']
  captchaTokenVerif(captchaToken, captchaPrivateKeyValue).then(
    (result: RESTOKENCAPTCHATYPE) => {
      //console.log(result)
      if (result.success === false) {
        return res.status(400).redirect(`/${data.lang}/contact.html`)
      }
      sendMail(
        data.firstname,
        data.lastname,
        data.email,
        data.phone,
        data.service,
        data.content
      )
      return res.status(201).redirect(`/${data.lang}/data-form.html`)
    }
  )
})

// mailServer.get('/api/test', (req, res) => {
//   //const data = req.body
//   console.log('test')
//   res.status(201).redirect('/career.html')
// })

// https://www.google.com/recaptcha/api/siteverify
// 'contact@amine-ouchiha.com'

// mailServer.post(
//   'https://www.google.com/recaptcha/api/siteverify',
//   (req, res) => {
//     const data = res.json
//     res.status(200).send(data)
//     //res.status(200).send(req.body)
//   }
// )

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
