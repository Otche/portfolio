import fetch from 'node-fetch'
import nodemailer from 'nodemailer'

export type RESTOKENCAPTCHATYPE = {
  success: boolean
  challenge_ts: string
  hostname: string
  action: string
}

export enum FORMFIELDSNAMESENUM {
  FIRSTNAME = 'firstname',
  LASTNAME = 'lastname',
  PHONE = 'fone',
  EMAIL = 'email',
  SERVICE = 'service',
  CONTENT = 'content',
}

export const captchaTokenVerif: (
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

export function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function labelNameValidation(name: string) {
  if (!name) return false
  const nameCharValidation = /^[A-Za-z]+-?[A-Za-z$]+$/
  const nameError =
    name.length < 2 ||
    name.length > 15 ||
    name.match(nameCharValidation) === null
  return nameError
}

export function dataFormValidation(
  firstanme: string,
  lastname: string,
  email: string,
  phone: string,
  service: string,
  content: string
) {
  if (labelNameValidation(firstanme)) throw 'invalid.firstname'
  if (labelNameValidation(lastname)) throw 'invalid.lastname'

  const mailCharValidation = /([\w\.]{2,20}@[\w\.]{2,20}\.{1}[\w]{2,5})/
  const emailError = email.match(mailCharValidation) === null
  if (emailError) throw 'invalid.email'
  const phoneCharValidation =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  const phoneError = phone.match(phoneCharValidation) === null
  if (phoneError) throw 'invalid.phone'
  if (!service) throw 'invalid.service'
  const contentError = content.length < 10
  if (contentError) throw 'invalid.content'
}

export function sendEmail(
  firstanme: string,
  lastname: string,
  email: string,
  phone: string,
  service: string,
  content: string
) {
  const body = escapeHtml(content)
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
                  <p>${body}</p>
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
