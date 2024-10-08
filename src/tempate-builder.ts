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
  'lang-dir': string[]
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
        const tempHtmlStrPage = await buildPage(tempaltePath, url)
        const objKeys = Object.keys(frLabels) as LangObjKeysType[]
        let fr_HtmlStrPage = tempHtmlStrPage
        let en_HtmlStrPage = tempHtmlStrPage
        objKeys.forEach((key) => {
          fr_HtmlStrPage = fr_HtmlStrPage.replace(
            `$lang(${key})`,
            frLabels[key]
          )
          en_HtmlStrPage = en_HtmlStrPage.replace(
            `$lang(${key})`,
            enLabels[key]
          )
        })
        return {
          url,
          fr_HtmlStrPage,
          en_HtmlStrPage,
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

  config['lang-dir'].forEach(async (lang) => {
    await fs.mkdir(`${outputDir}/${lang}`, {
      recursive: true,
    })
  })

  return Promise.all(
    htmlPagesInfo.map(async ({ url, fr_HtmlStrPage, en_HtmlStrPage }) => {
      try {
        config['lang-dir'].forEach(async (lang) => {
          if (lang.startsWith('fr') == true) {
            await fs.writeFile(
              path.resolve(`${outputDir}/${lang}/${url}`),
              fr_HtmlStrPage
            )
          }
          if (lang.startsWith('en') == true) {
            await fs.writeFile(
              path.resolve(`${outputDir}/${lang}/${url}`),
              en_HtmlStrPage
            )
          }
        })
      } catch (err) {
        console.error('Error when creating template of ', url)
        throw err
      }
    })
  )
}
