import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
// import { Store } from 'vuex'
import store, { State } from './store'
import type { UserInfo } from './store/modules/user'
import Cookies from "js-cookie"

import ElementPlus from 'element-plus'

// 注入svg脚本
import 'virtual:svg-icons-register';

const app = createApp(App)

app.use(router).use(store).use(ElementPlus).mount('#app')
