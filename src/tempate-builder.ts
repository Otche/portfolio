import path from 'path'
import data from './data.json'
import ejs from 'ejs'
import fs from 'fs/promises'

type PageNavType = {
  url: string
  label: string
  className: string
}

type TemplateDataType = {
  currentUrl: string
  header_section: { nav_pages: PageNavType[] }
}
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
export async function buildSite() {
  const templates = ['home.ejs', 'career.ejs', 'services.ejs' /*'contact.ejs'*/]

  const pagesInfo = templates.map((template) => {
    return {
      tempaltePath: path.resolve(`templates/${template}`),
      url: '/' + template.replace('ejs', 'html'),
    }
  })

  const htmlPagesInfo = await Promise.all(
    pagesInfo.map(async ({ tempaltePath, url }) => {
      try {
        const htmlStrPage = await buildPage(tempaltePath, url)
        return {
          url,
          htmlStrPage,
        }
      } catch (e) {
        console.error('Fail to generate tempalte of ', tempaltePath)
        throw e
      }
    })
  )

  await fs.mkdir('dist/pages', { recursive: true })

  return Promise.all(
    htmlPagesInfo.map(async ({ url, htmlStrPage }) => {
      try {
        await fs.writeFile(path.resolve(`dist/pages/${url}`), htmlStrPage)
      } catch (err) {
        console.error('Error when creating template of ', url)
        throw err
      }
    })
  )
}
