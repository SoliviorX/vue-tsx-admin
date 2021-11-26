import Cookies from 'js-cookie'
import TYPE from '../type/userType'
import { login, getUser } from '@/api/logins'
import { RouteRecordRaw } from 'vue-router'
import { Store } from 'vuex'
import router, { addRouter as asyncRouter, Routers } from '@/router/index'

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

type rolesValueItemType = {
  hidden: number
  icon?: string
  id: number
  level: number
  name: string
  parentId: number
  sort?: number
  title?: string
}

type Meta = {
  id: number
  title: string
  icon: string
}

// 格式数据
function addRouterFun(router: rolesValueItemType[], item: Routers): Routers | undefined {
  let each: rolesValueItemType

  for (each of router) {
    if (item.hidden) {
      item.sort = 0
      return item
    }

    if (item.name === each.name && each.hidden == 1) {
      ;(item.meta as Meta).id = each.id
      if (each.title) {
        ;(item.meta as Meta).title = each.title
      }
      if (each.icon) {
        ;(item.meta as Meta).icon = each.icon
      }
      item.sort = each.sort
      return item
    }
  }
}
// 排序
function _sort(arr: Routers[]) {
  arr.sort((a: Routers, b: Routers) => {
    return (b as { sort: number }).sort - (a as { sort: number }).sort
  })
}
// 递归菜单，查询子集
function recursion(each: Routers, childs: rolesValueItemType[]) {
  let ids: rolesValueItemType[] = []
  if (!each.children) {
    return []
  } else {
    if (each.meta && (each.meta as Meta).id) {
      ids = childs.filter((i: rolesValueItemType) => {
        ;(each.meta as Meta).id === i.parentId
      })
    }

    if (ids.length) {
      let children: Routers[] = []
      for (let childrenItem of each.children) {
        let arr = addRouterFun(ids, childrenItem)
        if (arr) {
          children.push(arr)
          // 递归查询
          recursion(arr, childs)
        }
      }
      _sort(children)
      return children
    } else {
      return []
    }
  }
}

// 筛选账号可展示的路由
function menuFilter(menus: rolesValueItemType[]) {
  // 一级
  let levelOne: rolesValueItemType[] = []
  // 子集
  let childs: rolesValueItemType[] = []

  menus.forEach((item: rolesValueItemType) => {
    if (item.level === 0) {
      levelOne.push(item)
    } else {
      childs.push(item)
    }
  })

  let asyncrouter = asyncRouter
    .map((item: Routers) => {
      let each = addRouterFun(levelOne, item)

      if (!each) {
        return false
      }

      const { ...eachCopy } = each
      eachCopy.children = recursion(eachCopy, childs)
      return eachCopy
    })
    .filter((item) => item) as Routers[]

  _sort(asyncrouter)

  asyncrouter.map((item: Routers) => {
    router.addRoute(item as RouteRecordRaw)
  })

  router.options.routes
    .concat(asyncrouter as RouteRecordRaw[])
    .forEach((item) => state.menus.push(item))
}

const actions = {
  // 登录
  loginAction(store: Store<UserState>, user: { username: string; password: number }) {
    return new Promise((resolve, reject) => {
      login(user)
        .then((res: { data: { tokenHead: string; token: string } }) => {
          if (res) {
            store.commit('setToken', res.data.tokenHead + res.data.token)
            Cookies.set('vToken', res.data.tokenHead + res.data.token)
            router.push({ path: '/' })
          }
          resolve(res)
        })
        .catch((err: { data: string }) => {
          reject(err.data)
        })
    })
  },

  // 获取用户信息
  userInfo(store: Store<UserState>) {
    return new Promise((resolve) => {
      getUser({ token: state.vToken }).then(async (res: any) => {
        store.commit(TYPE.LOGIN_THEN, res.data)
        menuFilter(res.data.menus)
        resolve(state.menus)
      })
    })
  },

  // 退出登录
  outLoging(store: Store<UserState>) {
    store.commit('outLogin', '')
    Cookies.remove('vToken')
  },

  tagsActions(store: Store<UserState>, val: { to: Tags; removeIndex?: number[]; name?: string }) {
    store.commit('tagsCommit', val)
  }
}

const mutations = {
  setToken(state: UserState, val: string) {
    state.vToken = val
  },
  outLogin(state: UserState, val: string) {
    state.vToken = val
    state.userInfo = {}
    state.menus = []
    router.push('/login')
  },
  // 设置用户信息（userInfo和menus）
  [TYPE.LOGIN_THEN](state: { userInfo: UserInfo; menus: [] }, val: UserInfo) {
    // 清空menus
    state.menus.splice(0)
    state.userInfo = val
  },
  // 重置tags
  tagsRefresh(state: UserState) {
    state.tags.splice(1)
  },
  tagsCommit(state: UserState, val: { to: Tags; removeIndex?: number[]; name?: string }) {
    if (val.removeIndex !== undefined || val.name !== undefined) {
      if (val.name) {
        const names = [val.name, 'home']
        state.tags = state.tags.filter((item) => names.indexOf(item.name as string) !== -1)
        return
      }

      val.removeIndex && state.tags.splice(val.removeIndex[0], val.removeIndex[1])
    } else {
      state.tags.push(val.to)
    }
  }
}

export default {
  state,
  actions,
  mutations
}
