<template>
  <div id="app">
    <!-- 头部 -->
    <v-header v-if="showHeader"></v-header>
    <router-view v-if="isReload"></router-view>
  </div>
</template>

<script>
import Header from "./components/Header";
export default {
  data() {
    return {
      isReload: true,
      showHeader: true,
    };
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  methods: {
    reload() {
      this.isReload = false;
      this.$nextTick(() => {
        this.isReload = true;
      });
    },
  },
  watch: {
    $route(to) {
      if (to.path === "/admin" || to.path === "/admin_login") {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    },
  },
  components: {
    vHeader: Header,
  },
};
</script>

<style lang="scss">
@import "./common/styles/index.scss";
html,
body {
  background-color: $bgColor;
  // margin: 0;
}
// 弹出框
.el-popover {
  min-width: auto !important;
}
@media screen and(max-width:767px) {
  .el-message-box {
    width: 80% !important;
  }
  // 当对话框小于768px是铺满全屏
  .el-dialog {
    margin: 0 !important;
  }

  // 弹出框
  .el-popover {
    min-width: auto !important;
  }
}
</style>
