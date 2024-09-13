import express from 'express'
import path from 'path'
import { buildSite } from './tempate-builder'

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
app.get('/*.html', async (req, res) => {
  return res.sendFile(path.resolve(`dist/pages/${req.url}`))
})

app.listen(PORT, async () => {
  console.log(`Server listning on port ${PORT}`)
  try {
    await buildSite()
    console.log('Page builded with sucess ...')
  } catch (e) {
    console.log('Failed when building page ....')
    throw e
  }
})
