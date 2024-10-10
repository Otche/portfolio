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

type SiteConfigType = {
  'root-template': string
  'public-dir': string
  'ejs-include': string[]
  'output-dir': string
  langs: string[]
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
 * @returns
 */
function getTransKeys() {
  const regexp = /(\$lang\((([a-z]|\.)*)\))/g
  const dataStr = JSON.stringify(data)
  const keys = []
  while (true) {
    const matchArray = regexp.exec(dataStr)
    if (matchArray == null) return keys
    keys.push(matchArray[2])
  }
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
 * @param langs
 * @returns
 */
async function getLangsTranslateInfo(langs: string[]) {
  const translateFilesPromises = langs.map(async (lang) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise<{ lang: string; translateData: any }>((resolve) => {
      fs.readFile(path.resolve(`src/lang/${lang}.json`)).then((translateData) =>
        resolve({
          lang,
          translateData: JSON.parse(translateData.toString()),
        })
      )
    })
  })
  const tranlateInfo = await Promise.all(translateFilesPromises)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return tranlateInfo.reduce<{ [k: string]: any }>((cumul, currVal) => {
    cumul[currVal.lang] = currVal.translateData
    return cumul
  }, {})
}

async function setupDirStruct(config: SiteConfigType, langs: string[]) {
  const outputDir = config['output-dir'] ? config['output-dir'] : 'site'
  await fs.mkdir(outputDir, { recursive: true })
  const publicDir = config['public-dir'] ? config['public-dir'] : './public'
  await fs.cp(path.resolve(publicDir), `${outputDir}/public`, {
    recursive: true,
  })

  langs.forEach(async (lang) => {
    await fs.mkdir(`${outputDir}/${lang}`, {
      recursive: true,
    })
  })
  return outputDir
}

async function translatePage(
  langs: string[],
  htmlpageInfo: string,
  traslateKeys: string[]
) {
  const tranlateInfo = await getLangsTranslateInfo(langs)
  return langs.map((lang) => {
    let translatedPage = htmlpageInfo
    const currentTransInfo = tranlateInfo[lang]
    traslateKeys.forEach((k) => {
      translatedPage = translatedPage.replace(
        `$lang(${k})`,
        currentTransInfo[k]
      )
    })
    return {
      lang,
      tempHtmlStrPage: translatedPage,
    }
  })
}

/**
 *
 * @returns
 */

export async function buildSite(config: SiteConfigType) {
  const templates = config['ejs-include']
  if (!templates || !templates.length) return
  const rootTemplateFile = config['root-template']
    ? path.resolve(config['root-template'])
    : 'template'
  const translateKeys = getTransKeys()
  const { langs } = config
  const outputDir = await setupDirStruct(config, langs)
  for (const template of templates) {
    const tempaltePath = path.resolve(`${rootTemplateFile}/${template}`)
    const url = '/' + template.replace('ejs', 'html')
    const htmlpageInfo = await buildPage(tempaltePath, url)
    const siteInfo = await translatePage(langs, htmlpageInfo, translateKeys)
    console.log(siteInfo)
    Promise.all(
      siteInfo.map(({ lang, tempHtmlStrPage }) => {
        return fs.writeFile(
          path.resolve(`${outputDir}/${lang}/${url}`),
          tempHtmlStrPage
        )
      })
    )
  }
}
