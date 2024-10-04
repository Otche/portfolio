import path from 'path'
import data from './data.json'
import ejs from 'ejs'
import fs from 'fs/promises'
import frLabels from './lang/fr.json'
import enLabels from './lang/en.json'

type PageNavType = {
  url: string
  label: string
  className: string
}

type TemplateDataType = {
  currentUrl: string
  header_section: { nav_pages: PageNavType[] }
}

type SiteConfigType = {
  'root-template': string
  'public-dir': string
  'ejs-include': string[]
  'output-dir': string
  'fr-output-dir': string
  'en-output-dir': string
}

type LangObjKeysType = keyof typeof frLabels

/**
 *
 * @param url
 * @returns
 */
export function templatingVars(url: string): TemplateDataType {
  const templateData = data as unknown as TemplateDataType
  templateData.currentUrl = url
  templateData.header_section.nav_pages.forEach((navPage) => {
    navPage.className = navPage.url === url ? 'active' : ''
  })
  return templateData
}

/**
 *
 * @param templatePath
 * @param url
 * @returns
 */
export async function buildPage(templatePath: string, url: string) {
  const templateData = templatingVars(url)
  const ejsOptions = {
    root: [path.resolve('templates/common/')],
  }

  return await ejs.renderFile(templatePath, templateData, ejsOptions)
}

/**
 *
 * @returns
 */

export async function buildSite(config: SiteConfigType) {
  const templates = config['ejs-include']
  if (!templates || !templates.length) return
  //, 'career.ejs', 'services.ejs', 'contact.ejs'
  const rootTemplateFile = config['root-template']
    ? path.resolve(config['root-template'])
    : 'template'
  const pagesInfo = templates.map((template) => {
    return {
      tempaltePath: path.resolve(`${rootTemplateFile}/${template}`),
      url: '/' + template.replace('ejs', 'html'),
    }
  })

  const htmlPagesInfo = await Promise.all(
    pagesInfo.map(async ({ tempaltePath, url }) => {
      try {
        const htmlStrPage = await buildPage(tempaltePath, url)
        const objKeys = Object.keys(frLabels) as LangObjKeysType[]
        let frHtmlStrPage = htmlStrPage
        let enHtmlStrPage = htmlStrPage
        objKeys.forEach((key) => {
          const regex = new RegExp('\\$lang\\(' + `${key}` + '\\)', 'g')
          frHtmlStrPage = frHtmlStrPage.replace(regex, frLabels[key])
          enHtmlStrPage = enHtmlStrPage.replace(regex, enLabels[key])
        })
        return {
          url,
          htmlStrPage,
          frHtmlStrPage,
          enHtmlStrPage,
        }
      } catch (e) {
        console.error('Fail to generate tempalte of ', tempaltePath)
        throw e
      }
    })
  )

  const outputDir = config['output-dir'] ? config['output-dir'] : 'site'
  await fs.mkdir(outputDir, { recursive: true })
  const publicDir = config['public-dir'] ? config['public-dir'] : './public'
  await fs.cp(path.resolve(publicDir), `${outputDir}/public`, {
    recursive: true,
  })
  const frOutputDir = config['fr-output-dir']
    ? config['fr-output-dir']
    : 'fr-site'
  await fs.mkdir(`${outputDir}/${frOutputDir}`, {
    recursive: true,
  })
  const enOutputDir = config['en-output-dir']
    ? config['en-output-dir']
    : 'en-site'
  await fs.mkdir(`${outputDir}/${enOutputDir}`, {
    recursive: true,
  })

  return Promise.all(
    htmlPagesInfo.map(
      async ({ url, htmlStrPage, frHtmlStrPage, enHtmlStrPage }) => {
        try {
          await fs.writeFile(path.resolve(`${outputDir}/${url}`), htmlStrPage)
          await fs.writeFile(
            path.resolve(`${outputDir}/${frOutputDir}/${url}`),
            frHtmlStrPage
          )
          await fs.writeFile(
            path.resolve(`${outputDir}/${enOutputDir}/${url}`),
            enHtmlStrPage
          )
        } catch (err) {
          console.error('Error when creating template of ', url)
          throw err
        }
      }
    )
  )
}
