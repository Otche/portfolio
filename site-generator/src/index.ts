import { buildSite } from './tempate-builder'
import config from './site.config.json'

buildSite(config)
  .then()
  .catch((error) => {
    console.error('Error building site:', error)
    process.exit(1)
  })
