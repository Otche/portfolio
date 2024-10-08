import express from 'express'
import path from 'path'
import config from '../site.config.json'

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
      : `${config['output-dir'] || 'site'}/public/${req.url}`
  res.status(200).sendFile(path.resolve(pagePath))
})

/**
 * root router to intercept .html get request
 */
app.get('/*.html', async (req, res) => {
  return res.sendFile(
    path.resolve(
      `${config['output-dir'] || 'site'}/${config['lang-dir'][0]}/${req.url}`
    )
  )
})

app.listen(PORT, () => {
  console.log('server started : ' + PORT)
})
