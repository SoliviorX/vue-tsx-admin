import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import { Store } from 'vuex'
import store, { State } from './store'
import type { UserInfo } from './store/modules/user'
import Cookies from 'js-cookie'
import { log } from '@/utils/interface'
import { parseTime } from '@/utils/parse-time'

// 导入自定义指令
import directive from './directives'

// element-plus
import ElementPlus from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import powerfulTable from 'el-plus-powerful-table' // 更强大的table插件

// 注入svg脚本
import 'virtual:svg-icons-register'

// 导入css
import './styles/index.scss'

// 路由守卫
import './router-guard'

// 国际化
import 'dayjs/locale/zh-cn'
import cn from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/en'
import en from 'element-plus/lib/locale/lang/en'

// i18n
import VueI18n from './language'
import { useI18n } from 'vue-i18n'

// 全局静态配置
import defaultData, { defaultDataType } from './config/default-data'
import { debounce, throttle } from './config/debounce-throttle'
import { permissionFun } from './config/roles-permission'

if ((import.meta as any).env.MODE !== 'development') {
  window.console.log = () => {}
}

// 向所有组件实例注入自定义属性声明
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    defaultData: defaultDataType // 这里可以用$Api具体的类型代替any
    $debounce: Function
    $throttle: Function
    $permission: Function
    $store: Store<State>
    $router: Router
    $route: RouteLocationNormalizedLoaded
  }
}

const app = createApp(App)
/**
 * 像所有组件提供数据，通过inject使用
 * 举例：let message = inject("$message"); message.success('修改成功！')
 */
app.provide('$message', ElMessage)
app.provide('messageBox', ElMessageBox)

// 向所有组件的computed中混入两个属性
app.mixin({
  computed: {
    t() {
      const { t } = useI18n()
      return t
    },
    themeColor() {
      return store.getters.getThemeColor
    }
  }
})

// 判断初始语言
const locale = defaultData.locale === 'zh-CN' ? cn : en

app
  .use(router)
  .use(store)
  .use(powerfulTable)
  .use(ElementPlus, { size: Cookies.get('size') || 'smalll', zIndex: 3000, locale })
  .use(VueI18n)
  .mount('#app')

// 添加全局自定义指令
directive(app)

/**
 * 每个 Vue 应用都会暴露一个 config 对象
 * app.config.errorHandler可指定一个处理函数，来处理组件渲染方法和侦听器执行期间抛出的未捕获错误。
 * app.config.globalProperties添加一个可以在应用的任何组件实例中访问的全局 property。这个方式用来替代vue2中的vue.prototype.xxx
 */
app.config.errorHandler = (error: unknown, instance: any, info: string) => {
  console.log(error)
  let data: log = {
    url: window.location.href,
    info,
    error,
    type: 'Bug',
    name: (store.state.user.userInfo as UserInfo).username,
    time: parseTime(new Date())
  }
  store.commit('setErrorLog', data)
}
app.config.globalProperties.defaultData = defaultData
app.config.globalProperties.$debounce = debounce
app.config.globalProperties.$throttle = throttle
app.config.globalProperties.$permission = permissionFun
