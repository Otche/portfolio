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
    navPage.className = navPage.url === `/$[lang]${url}` ? 'active' : ''
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
    escape: (str: string) => str,
    escapeXML: (str: string) => str,
  }

  return await ejs.renderFile(templatePath, templateData, ejsOptions)
}
/**
 *
 * @param langs
 * @returns
 */
async function getLangsTranslateInfo(langs: string[]) {
  if (!langs || !langs.length) throw new Error('No languages defined !')
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
/**
 *
 * @param config
 * @param langs
 * @returns
 */
async function setupDirStruct(config: SiteConfigType, langs: string[]) {
  if (!config) throw new Error('No config found !')
  if (!langs || !langs.length)
    throw new Error('No languages defined in config !')
  if (!config['output-dir'])
    throw new Error('No output directory defined in config !')
  if (!config['public-dir'])
    throw new Error('No public directory defined in config !')

  const outputDir = config['output-dir']
  const publicDir = config['public-dir']
  await fs.mkdir(outputDir, { recursive: true })

  await fs.cp(path.resolve(publicDir), `${outputDir}/public`, {
    recursive: true,
  })
  await fs.cp(
    path.resolve(`${publicDir}/assets/images/favicon.ico`),
    `${outputDir}/favicon.ico`
  )

  langs.forEach(async (lang) => {
    await fs.mkdir(`${outputDir}/${lang}`, {
      recursive: true,
    })
  })
  return outputDir
}
/**
 *
 * @param langs
 * @param htmlpageInfo
 * @param traslateKeys
 * @returns
 */
async function translatePage(
  langs: string[],
  htmlpageInfo: string,
  traslateKeys: string[]
) {
  if (!langs || !langs.length)
    throw new Error('No languages defined for translation !')
  if (!htmlpageInfo || !htmlpageInfo.length)
    throw new Error('No html page info to translate !')
  if (!traslateKeys || !traslateKeys.length)
    throw new Error('No translation keys defined !')
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

    if (lang === 'en') {
      translatedPage = translatedPage.replace('btn_active', '$frbtn')
      translatedPage = translatedPage.replace('$enbtn', 'btn_active')
    }
    if (lang === 'fr') {
      translatedPage = translatedPage.replace('btn_active', '$enbtn')
      translatedPage = translatedPage.replace('$frbtn', 'btn_active')
    }

    if (!process.env.PUBLIC_CAPTCHA_KEY) {
      throw new Error('Public key parameter is empty !')
    }
    if (process.env.PUBLIC_CAPTCHA_KEY.length < 30) {
      console.log(process.env.PUBLIC_CAPTCHA_KEY)
      throw new Error('Your public key is not valid !')
    }
    translatedPage = translatedPage.replace(
      '$[public-key]',
      process.env.PUBLIC_CAPTCHA_KEY
    )

    return {
      lang,
      tempHtmlStrPage: translatedPage.replaceAll('$[lang]', lang),
    }
  })
}

/**
 *
 * @param config
 * @returns
 */
export async function buildSite(config: SiteConfigType) {
  const templates = config['ejs-include']
  if (!templates || !templates.length)
    throw new Error('No templates to build !')
  if (!config['root-template'])
    throw new Error('No root template defined in config !')
  const rootTemplateFile = path.resolve(config['root-template'])
  const translateKeys = getTransKeys()
  const { langs } = config
  const outputDir = await setupDirStruct(config, langs)
  /**
   * Build each template
   */
  for (const template of templates) {
    const tempaltePath = path.resolve(`${rootTemplateFile}/${template}`)
    const url = '/' + template.replace('ejs', 'html')
    const htmlpageInfo = await buildPage(tempaltePath, url)
    const siteInfo = await translatePage(langs, htmlpageInfo, translateKeys)
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
