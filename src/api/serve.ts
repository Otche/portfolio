import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {
  dataFormValidation,
  captchaTokenVerif,
  sendEmail,
  RESTOKENCAPTCHATYPE,
} from './services'

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

/**
 * mail server
 */

mailServer.post('/api/contact', (req, res) => {
  const { firstname, lastname, email, phone, content, lang, service } = req.body
  try {
    dataFormValidation(firstname, lastname, email, phone, service, content)
  } catch (e) {
    console.error('contact form validation ', e)
    return res
      .status(400)
      .redirect(
        `/${lang}/contact.html?error=${e}&firstname=${firstname}&lastname=${lastname}&email=${email}&phone=${phone}&service=${service}&content=${content}&lang=${lang}`
      )
  }

  const captchaPrivateKeyValue = process.env.PRIVATE_CAPTCHA_KEY
  if (!captchaPrivateKeyValue) {
    console.error('Privete key parameter is empty !')
    return res.status(400).redirect(`/${lang}/contact.html`)
  }
  if (captchaPrivateKeyValue.length < 30) {
    console.error('Your Privete key is not valid !')
    return res.status(400).redirect(`/${lang}/contact.html`)
  }
  const captchaToken = req.body['g-recaptcha-response']
  captchaTokenVerif(captchaToken, captchaPrivateKeyValue).then(
    (result: RESTOKENCAPTCHATYPE) => {
      if (result.success === false) {
        return res.status(400).redirect(`/${lang}/contact.html`)
      }
      sendEmail(firstname, lastname, email, phone, service, content)
      return res.status(201).redirect(`/${lang}/data-form.html`)
    }
  )
})

// mailServer.get('/test', (req, res) => {
//   const data = req.body
//   console.log('test')
//   res.send('hello')
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

mailServer.listen(PORT, () => {
  console.log('listen on  5000')
})
