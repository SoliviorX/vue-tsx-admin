/**
 * 权限指令
 */

import type { App } from 'vue'
import store from '@/store/index'

export default function permission(app: App) {
  app.directive('permission', (el, bind) => {
    const all = bind.arg

    const roles = store.getters.getUserInfo.roles

    if (!roles || !bind.value) {
      throw new Error(`roles 或 bind.value 不能为空`)
    }

    const value = bind.value instanceof Array ? bind.value : [bind.value]
    const hasPermission = value.filter((role: string) => roles.include(role))

    if (all ? value.length !== hasPermission.length : !hasPermission.length) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  })
}
