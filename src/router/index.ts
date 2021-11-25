import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { DefineComponent } from 'vue'
const Layout = () => import('@/layout/index.vue')

/**
 * meta参数
 * @param {string} title 标题
 * @param {string} icon 图标
 * @param {string} locale i18n配置的属性，在src/language文件夹中
 * @param {boolean} breadcrumb “面包屑”导航栏
 * @param {string} url 外链
 * @param {string} iframeUrl 内嵌网页
 * @param {string} iframeData 内嵌网页的attr
 */

export interface Routers {
    path: string,
    component: DefineComponent | Function,
    name?: string,
    redirect?: string,
    meta?: {
        title: string,
        icon: string,
        locale?: string,
        breadcrumb?: boolean,
        url?: string,
        iframeUrl?: string,
        iframeData?: any
    },
    children?: Routers[],
    hidden?: boolean,
    sort?: number
}

const routes: Routers[] = [
    {
        path: '/',
        component: Layout,
        redirect: "/home",
        meta: {
            title: '首页',
            icon: 'viteshouye',
            locale: 'home'
        },
        children: [
            {
                path: "home",
                name: "home",
                component: () => import("@/views/home/index.vue"),
                meta: {
                    title: "首页",
                    locale: 'home',
                    icon: "viteshouye",
                },
            },
        ],
    },
    {
        path: '/redirect',
        name: 'redirect',
        hidden: true,
        component: () => import("@/views/redirect.vue"),
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: "登录",
            icon: "about"
        },
        hidden: true,
        component: () => import("@/views/login/index.vue")
    }
]

const _router = createRouter({
    history: createWebHistory(),
    routes: routes as RouteRecordRaw[]
})

export default _router