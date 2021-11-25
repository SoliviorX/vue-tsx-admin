import Cookies from 'js-cookie'
import TYPE from '../type/userType'
import { RouteRecordRaw } from 'vue-router'
import { Store } from 'vuex'
import router from '@/router/index'
import { login } from '@/api/logins'

export type UserInfo = {
  icon: string
  id: number
  roles: string[]
  username: string
}

export type Tags = {
  path: string
  name?: string
  meta?: {
    title: string
    icon?: string
    locale?: string
    breadcrumb?: boolean
    url?: string
    iframeUrl?: string
    iframeData?: any
  }
  remove?: boolean
  query?: {}
  params?: {}
}

export interface UserState {
  vToken: string
  userInfo: UserInfo | {}
  menus: RouteRecordRaw[]
  tags: Tags[]
}

const state: UserState = {
  vToken: Cookies.get('vToken'),
  userInfo: {},
  menus: [],
  tags: [
    {
      path: '/',
      name: 'home',
      meta: {
        locale: 'home',
        title: '首页'
      },
      remove: true
    }
  ]
}

const actions = {
  loginAction(store: Store<UserState>, user: { username: string; password: number }) {
    return new Promise((resolve, reject) => {
      login(user)
        .then((res: { data: { tokenHead: string; token: string } }) => {
          if (res) {
            store.commit('setToken', res.data.tokenHead + res.data.token)
            Cookies.set('vToken', res.data.tokenHead + res.data.token)
            router.push({ path: '/' })
          }
        })
        .catch((err: { data: string }) => {
          reject(err.data)
        })
    })
  }
}

const mutations = null

export default {
  state,
  actions,
  mutations
}
