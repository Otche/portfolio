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
  navPages: PageNavType[]
  home: {
    [k: string]: unknown
  }
}

export const templatingVars = (url: string): TemplateDataType => {
  return {
    currentUrl: url,
    ...data,
    navPages: data.navPages.map((pn) => {
      return {
        ...pn,
        className: pn.url === url ? 'active' : '',
      }
    }),
  }
}

export const buildPage = async (templatePath: string, url: string) => {
  const templateData = templatingVars(url)
  const ejsOptions = {
    root: [path.resolve('templates/common/')],
  }
  try {
    return await ejs.renderFile(templatePath, templateData, ejsOptions)
  } catch (error) {
    console.log(error)
  }
}

export const buildSite = async (): Promise<boolean> => {
  const templates = ['home.ejs', 'career.ejs', 'services.ejs', 'contact.ejs']
  return templates
    .map((template) => {
      return {
        tempaltePath: path.resolve(`templates/${template}`),
        url: template.replace('ejs', 'html'),
      }
    })
    .map(({ tempaltePath, url }) => {
      return { url, buildPromise: buildPage(tempaltePath, url) }
    })
    .map(async ({ url, buildPromise }) => {
      try {
        const htmlStringPage = await buildPromise
        if (!htmlStringPage) {
          console.error(`build template for page ${url} feiled`)
          return false
        }
        await fs.mkdir('dist/pages', { recursive: true })
        await fs.writeFile(path.resolve(`dist/pages/${url}`), htmlStringPage)
        return true
      } catch (e) {
        console.error(`build template for page ${url} feiled`, e)
        return false
      }
    })
    .reduce(
      async (acc, check) => (await acc) && (await check),
      Promise.resolve(true)
    )
}
