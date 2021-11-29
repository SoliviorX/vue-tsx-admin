<template>
  <div class="content">
    <div :class="['left']">
      <menus :collapse="collapse"></menus>
    </div>
    <div class="right" :style="
        !collapse
          ? { marginLeft: '65px', width: 'calc(100% - 65px)' }
          : {
              marginLeft:
                (store.leftMargin || 200) + 'px',
              width: `calc(100% - ${
                store.leftMargin || 200
              }px)`,
          }
      ">
      <div class="top" :style="{
          boxShadow:
            store.fixed === 1
              ? '5px 5px 5px 0px rgba(0,0,0,0.1)'
              : '0 0 0 0',
          position:
            store.fixed === 1
              ? 'sticky'
              : 'static',
          top: 0,
        }">
        <navs @isCollapse="isCollapse" :collapse="collapse"></navs>
        <tags-view
          :collapse="collapse"
          v-if="store.isTagsView"
        ></tags-view>
      </div>

      <div class="view" id="view"  v-press-key:s="() => $throttle(() => useSearch = true, 100)"
        :style="{
          minHeight: `calc(100% - ${store.isTagsView ? '91px' : '50px'})`
        }">
        <transition name="searchView">
          <search-view v-show="useSearch" class="search-view"></search-view>
        </transition>

        <transition name="searchView">
          <!-- esc 对应的keypress key值为escape -->
          <div v-show="!useSearch" v-press-key:escape="() => $throttle(() => useSearch = false, 100)">
            <router-view v-if="!meta.iframeUrl"></router-view>
            <iframe v-else :src="meta.iframeUrl" frameborder='0' v-bind="meta.iframeData"></iframe>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import menus from './components/menus.vue'
import navs from './components/navs.vue'
import TagsView from './components/tags-view.vue'
import SearchView from './components/search-view.vue'
import routerView from './components/router-view.vue'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useSearch } from '@/hooks/states'

export default defineComponent({
  components: {
    menus,
    navs,
    TagsView,
    SearchView,
    routerView
  },
  setup() {
    const store = useStore().state.settings.drawerSetting
    const route = useRoute()
    // collapse为false表示折叠，true表示展开
    const collapse = computed(() => !!store.defaultMenu)
    const meta = computed(() => route.meta)

    function isCollapse (e) {
      collapse.value = e
    }
    return {
      store,
      collapse,
      isCollapse,
      meta,
      useSearch
    }
  }
})
</script>

<style lang='scss' scoped>
.content {
  min-height: 100vh;
  display: flex;
  justify-content: space-between;
  .left {
    height: 100%;
    max-width: 200px;
  }
  .right {
    position: relative;
    right: 0;
    transition: all 0.3s;
    .top {
      width: 100%;
      position: -webkit-sticky;
      position: sticky;
      z-index: 6;
      background: #fff;
    }
    .view {
      width: 100%;
      background: #eff1f4;
      box-sizing: border-box;
      padding: 20px;
      overflow: hidden;
      position: relative;
      .search-view{
        height: 100%;
        width: calc(100% - 40px);
        position: absolute;
      }
    }
  }
}
</style>