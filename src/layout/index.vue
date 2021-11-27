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
      </div>
      <div class="view" id="view" :style="{
          minHeight: `calc(100% - ${store.isTagsView ? '91px' : '50px'})`
        }">
        content
      </div>
    </div>
  </div>
</template>

<script>
import menus from './components/menus.vue'
import navs from './components/navs.vue'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  components: {
    menus,
    navs
  },
  setup() {
    const store = useStore().state.settings.drawerSetting
    // collapse为false表示折叠，true表示展开
    const collapse = computed(() => !!store.defaultMenu)

    function isCollapse (e) {
      collapse.value = e
    }
    return {
      store,
      collapse,
      isCollapse
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