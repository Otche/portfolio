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
 *
 * @param headerLangOrder
 * @returns
 */
function getLang(headerLangOrder: string | undefined) {
  if (!headerLangOrder) {
    return 'en'
  }
  const frindex = headerLangOrder?.indexOf('fr;')
  const enindex = headerLangOrder?.indexOf('en;')
  if (frindex < 0 || enindex < frindex) {
    return 'en'
  }

  return 'fr'
}
app.get('/', async (req, res) => {
  const lang = getLang(req.headers['accept-language'])
  res.redirect(`/${lang}/home.html`)
})
/**
 * root router to intercept .html get request
 */
app.get('/*.html', async (req, res) => {
  if (!req.url.startsWith('/fr/') && !req.url.startsWith('/en/')) {
    const lang = getLang(req.headers['accept-language'])
    return res.redirect(`/${lang}${req.url}`)
  }

  return res.sendFile(
    path.resolve(`${config['output-dir'] || 'site'}/${req.url}`)
  )
})

app.listen(PORT, () => {
  console.log('server started : ' + PORT)
})
