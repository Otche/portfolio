import express from 'express'
import path from 'path'
import ejs from 'ejs'

const PORT = process.env.PORT || 3000
const app = express()
const staticFile = express()

app.use('/public', staticFile)

const templatingVars = (url: string) => {
  return {
    currentUrl: url,
    pages: [
      {
        url: './home.html',
        label: 'Home',
        className: url === '/home.html' ? 'active' : '',
      },
      {
        url: './services.html',
        label: 'Serive',
        className: url === '/services.html' ? 'active' : '',
      },
      {
        url: './career.html',
        label: 'Carrière',
        className: url === '/career.html' ? 'active' : '',
      },
      {
        url: './contact.html',
        label: 'Contact',
        className: url === '/contact.html' ? 'active' : '',
      },
    ],
  }
}

staticFile.get('*', (req, res) => {
  const pagePath =
    req.url === '/normalize.css'
      ? 'node_modules/normalize.css/normalize.css'
      : `public/${req.url}`
  res.status(200).sendFile(path.resolve(pagePath))
})

app.get('/*.html', (req, res) => {
  const pageFileToRenderPath = path.resolve(
    `templates${req.url.replace('html', 'ejs')}`
  )

  ejs.renderFile(
    pageFileToRenderPath,
    templatingVars(req.url),
    {
      root: [path.resolve('templates')],
    },
    (err, htmlStringPage) => {
      if (err) return res.sendStatus(404)
      res.status(200).send(htmlStringPage)
    }
  )
})

app.listen(PORT, () => {
  console.log(`Server listning on port ${PORT}`)
})
