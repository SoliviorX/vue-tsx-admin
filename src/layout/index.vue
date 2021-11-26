<template>
  <div class="content">
    <div :class="['left']">
      leftleftleftleft
    </div>
    <div class="right" :style="{marginLeft: '65px', width: 'calc(100% - 65px)'}">
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
        top
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
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore().state.settings.drawerSetting
    return {
      store
    }
  }
}
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