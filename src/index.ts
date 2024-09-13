import express from 'express'
import path from 'path'
import ejs from 'ejs'
import { templatingVars } from './tempate-builder'

const PORT = process.env.PORT || 3000
const app = express()
const staticFiles = express()

app.use('/public', staticFiles)

/**
 * subroot /public to expose all  route to get static files
 */
staticFiles.get('*', (req, res) => {
  const pagePath =
    req.url === '/normalize.css'
      ? 'node_modules/normalize.css/normalize.css'
      : `public/${req.url}`
  res.status(200).sendFile(path.resolve(pagePath))
})

/**
 * root router to intercept .html get request
 */
app.get('/*.html', (req, res) => {
  const pageFileToRenderPath = path.resolve(
    `templates${req.url.replace('html', 'ejs')}`
  )
  const templateData = templatingVars(req.url)

  ejs.renderFile(
    pageFileToRenderPath,
    templateData,
    {
      root: [path.resolve('templates/common/')],
    },
    (err, htmlStringPage) => {
      if (err) {
        console.log(err)
        return res.sendStatus(404)
      }
      res.status(200).send(htmlStringPage)
    }
  )
})

app.listen(PORT, () => {
  console.log(`Server listning on port ${PORT}`)
})
