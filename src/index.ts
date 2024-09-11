import express from 'express'
import path from 'path'

const PORT = process.env.PORT || 3000
const app = express()

app.get('*', (req, res) => {
  const pagePath =
    req.url === '/normalize.css'
      ? 'node_modules/normalize.css/normalize.css'
      : `public/${req.url}`
  res.status(200).sendFile(path.resolve(pagePath))
})

app.listen(PORT, () => {
  console.log(`Server listning on port ${PORT}`)
})
