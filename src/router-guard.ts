import router from './router/index'
import store from './store'
import Nprogress from 'nprogress'

import { NextLoading } from '@/utils/loading'

Nprogress.configure({ showSpinner: false })

const notRedirect = ['/login'] // 不重定向的白名单

router.beforeEach((to, from, next) => {
  Nprogress.start()

  if (
    window.location.host === 'Shideshanxx.github.io' &&
    (import.meta as any).env.BASE_URL === '/vite-vue-admin/' &&
    to.path === '/vite-vue-admin/'
  ) {
    next('/')
    Nprogress.done()
  }

  // 1 判断是否有token
  // 1.1 判断是否有menus(动态路由。页面刷新后vuex会重置)
  // 1.1.1 重新获取动态路由表
  // 1.1.2 直接跳转 next()

  // 1.2 判断是否在重定向的白名单
  // 1.2.1 重定向到登录页
  // 1.2.2 留在当前页
  if (store.getters.getToken) {
    if (store.getters.getMenu.length === 0) {
      store.dispatch('userInfo').then(() => {
        next({ ...to, replace: true })
        Nprogress.done()
      })
    } else {
      next()
      Nprogress.done()
    }
  } else {
    setTimeout(() => {
      notRedirect.indexOf(to.path) !== -1 ? next() : next('/login')
    }, 1000)
  }
})

router.afterEach(() => {
  NextLoading.done()
  Nprogress.done()
})
