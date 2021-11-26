import { createI18n } from 'vue-i18n'
import defaultData from '@/config/default-data'

const modules = (import.meta as any).globEager('./*')
const viewModules = (import.meta as any).globEager('../views/**/locales/*.ts')
const componentModules = (import.meta as any).globEager('../components/**/locales/*.ts')
const utilsModules = (import.meta as any).globEager('../utils/locales/*.ts')

type Message = {
  [s: string]: {} | undefined
}
type RtnMessage = {
  'zh-TW': {}
  'zh-CN': {}
  'en-US': {}
  [s: string]: {}
}

export function getLangAll(): RtnMessage {
  let message: Message = {}
  getLangFiles(modules, message)
  getLangFiles(viewModules, message)
  getLangFiles(componentModules, message)
  getLangFiles(utilsModules, message)

  return message as RtnMessage
}
type MList = {
  [s: string]: { default: { [s: string]: string } }
}
function getLangFiles(mList: MList, msg: Message) {
  for (let path in mList) {
    if (mList[path].default) {
      // 判断是否中英文混合文件
      if (/zh-and-en/.test(path)) {
        type LocaleObj = {
          [s: string]: any
        }
        let localeObj: LocaleObj = {
          'zh-CN': {},
          'en-US': {}
        }
        // 将modulesList中的数据写入localeObj
        for (let i in mList[path].default) {
          localeObj['zh-CN'][i] = mList[path].default[i]
          localeObj['en-US'][i] = i.replace(/\./g, '')
        }
        // 将localeObj合并到msg中
        for (let i in localeObj) {
          if (msg[i]) {
            msg[i] = {
              ...msg[i],
              ...localeObj[i]
            }
          } else {
            msg[i] = localeObj[i]
          }
        }
      } else {
        // 获取文件名
        let pathName = path.substr(path.lastIndexOf('/') + 1, 5)

        if (msg[pathName]) {
          msg[pathName] = {
            ...msg[pathName],
            ...mList[path].default
          }
        } else {
          msg[pathName] = mList[path].default
        }
      }
    }
  }
}

// 将locale信息存到localStorage
export function SETLOCALE(lang: string) {
  window.localStorage.setItem('locale', lang)
  window.location.reload()
}

const i18n = createI18n({
  legacy: false,
  locale: defaultData.locale,
  message: getLangAll()
})

export default i18n
