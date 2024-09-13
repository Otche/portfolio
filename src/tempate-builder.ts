import data from './data.json'

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
