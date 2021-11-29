<template>
  <div class="search-view">
    <div class="wrap">
      <img src="/src/assets/logo.svg" style="width: 50px" alt="vite-tsx-vue-admin">
      <p>{{defaultData.name}}</p>
      <el-input placeholder="搜索页面（路径或名称）" v-model="searchValue" :suffix-icon="Search"></el-input>
      <div class="tip">
        {{ t('you.can.use.shortcut.keys') }} <span>s</span> {{ t('call.up.the.search.panel,press') }} <span>esc</span> {{t('close')}}
      </div>
    </div>

    <el-card :shadow="defaultData.cardShadow" body-style="padding: 0; height: 100%;" style="border: none; height: calc(100% - 240px);">
      <el-scrollbar>
        <el-empty description="抱歉，没有找到相关页面!" v-show="!funMenu().length"></el-empty>
        <template v-for="item in funMenu()">
          <div v-if="item.meta && item.meta.locale" :key="item.meta.locale" :label="item.path" :value="item.name" class="menu-item" @click="navTo(item)">
            <i :class="[item.meta.icon, defaultData.iconfont]"></i>
            <div>
              <div class="name">
                {{ item.meta.locale ? t(item.meta.locale) : '' }}
              </div>
              <div class="path">
                <span v-for="(s, i) in item.locales">{{ s && t(s) }} {{ i === item.locales.length - 1 ? '' : '/' }} </span>
              </div>
              <div class="path">
                {{ item.path }}
              </div>
            </div>
          </div>
        </template>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, watch } from 'vue'
import {useSearch} from '@/hooks/states'
import { Routers } from '@/router/index'
import { Search } from '@element-plus/icons'

const Store = useStore()
const router = useRouter()
const route = useRoute()
const {t} = useI18n()
const searchValue = ref<string>('')
watch(() => route.path, () => {
  useSearch.value = false
})

type Arr = Routers & {locales: string[]}

// menus操作
const searchMenuFun = (arr: Arr[], menu: Arr[], superior?: Arr) => {
  arr.forEach((each: Arr) => {
    let item = {...each}
    if (!item.hidden as boolean && item.name) {
      item.locales = superior && superior?.locales ? superior.locales.concat([(item.meta as {locale: string}).locale]) : (item.meta && item.meta.locale ? [item.meta.locale] : [])
      if(item.children) {
        item.path = superior ? superior.path + '/' + item.path : item.path
        menu.push(item)
        menu.concat(searchMenuFun(item.children as Arr[], menu, item))
      } else {
        item.path = (superior && superior.path) + '/' + item.path
        menu.push(item)
      }
    }
  })
  return menu
}

let menus = searchMenuFun(Store.state.user.menus, [])

// 筛选菜单
const funMenu = () => {
  if(searchValue.value === '') {
    return menus
  }
  
  return menus.filter((item: Arr) => {
    // 筛选出 路径path包含searchValue  或者  meta.locale（即标题）通过t函数翻译之后包含searchValue 的menus
    return item.path.indexOf(searchValue.value) !== -1 || (item.meta && item.meta.locale) && t(item.meta.locale as string).indexOf(searchValue.value) !== -1
  })
}

// 跳转
const navTo = (item: Arr) => {
  router.push({
    // 去掉path中的空格
    path: item.path.replace(' ', '')
  })
}
</script>

<style lang="scss" scoped>
.wrap{
  margin: 0 auto 50px;
  height: 150px;
  width: 40%;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: center;

  p{
    text-align: center;
    width: 100%;
    margin: 0 0 10px;
    color: var(--color-primary);
    font-weight: bold;
  }

  .tip{
    margin-top: 10px;
    font-size: 12px;
    color: #999;
    span{
      display: inline-block;
      padding: 0px 5px;
      height: 18px;
      line-height: 18px;
      background: var(--color-primary);
      border-radius: 2px;
      color: #fff;
      margin: 0 3px;
    }
  }
}

.menu-item{
  display: flex;
  color: #444;
  transition: all .2s;
  border-left: 0px solid var(--color-primary);
  
  &:hover{
    background: #f5f7fa;
    color: var(--color-primary);
    border-left: 4px solid var(--color-primary);
  }

  i{
    padding: 20px;
    font-size: 22px;
  }

  >div{
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    padding-left: 10px;
    // border-left: 1px solid #ddd;

    .name{
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 14px;
    }
    .path{
      width: 100%;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>