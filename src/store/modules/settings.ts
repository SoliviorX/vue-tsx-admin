import config from '@/config/default-data'
import { create, remove } from '@/utils/watermark'
import { nextTick } from 'vue'

import { drawerSetting, themeColor, log, menuColors, waterMarkType } from '@/utils/interface'

export interface SettingsState {
  themeColor?: themeColor
  errorLog?: log[]
  drawerSetting?: drawerSetting
  menuColors?: menuColors
  waterMark?: waterMarkType
}
// 初始化，是否有灰度
if (config.settings.grayMode) {
  document.getElementsByTagName('body')[0].style.filter = 'grayscale(1)'
}

let state: SettingsState = {
  themeColor: config.themeColor,
  errorLog: [],
  drawerSetting: config.settings,
  menuColors: config.menuColors,
  waterMark: config.waterMark
}
// 添加水印
nextTick(() => {
  config.waterMark.switch && create(config.waterMark)
})
let mutations = {
  setErrorLog(state: SettingsState, val: log) {
    state.errorLog?.push(val)
  },
  // 修改主题颜色
  setThemeColor(state: SettingsState, payload: { key: string; val: string }) {
    if (state.themeColor) {
      state.themeColor[payload.key] = payload.val
    }
  },
  // 修改菜单
  setMenuColor(state: SettingsState, { key, val }: { key: string; val: string }) {
    if (state.menuColors) {
      state.menuColors[key] = val
    }
  },
  // 修改layout配置
  setDrawerSetting(state: SettingsState, { key, val }: { key: string; val: number }) {
    if (state.drawerSetting) {
      state.drawerSetting[key] = val
    }
    window.localStorage.setItem('settings', JSON.stringify(state.drawerSetting))
  },
  // 修改水印
  setWaterMark(state: SettingsState, { key, val }: { key: string; val: string }) {
    if (state.waterMark) {
      state.waterMark[key] = val
    }
    state.waterMark?.switch ? create(state.waterMark) : remove()
    window.localStorage.setItem('waterMark', JSON.stringify(state.waterMark))
  },
  // 修改layout setting
  // 不缓存到localstorage，用于非全局配置栏目修改全局配置的数据
  setSetting(state: SettingsState, { key, val }: { key: string; val: number }) {
    if (state.drawerSetting) {
      state.drawerSetting[key] = val
    }
  }
}

export default {
  state,
  mutations
}
