<template>
  <div id="app">
    <!-- 头部 -->
    <v-header></v-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "./components/Header";
export default {
  methods: {
    init() {}
  },
  created() {
    this.init();
  },
  components: {
    vHeader: Header
  }
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
