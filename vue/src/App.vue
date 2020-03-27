<template>
  <div id="app">
    <v-home></v-home>
  </div>
</template>

<script>
import Home from "./views/Home";

export default {
  methods: {
    init() {}
  },
  created() {
    this.init();
  },
  components: {
    vHome: Home
  }
};
</script>

<style lang="scss">
@import "./common/styles/index.scss";
html,
body {
  background-color: $bgColor;
}
@media screen and(max-width:767px) {
  .el-message-box {
    width:80% !important;
  }
  // 当对话框小于768px是铺满全屏
  .el-dialog {
    margin: 0 !important;
    height: 100%;
  }
}
</style>
