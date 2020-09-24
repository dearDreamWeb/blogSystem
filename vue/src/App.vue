<template>
  <div id="app">
    <!-- 头部 -->
    <v-header
      v-if="showHeader"
      :postTag="postTag"
      @searchPostTag="searchPostTag"
    ></v-header>
    <router-view v-if="isReload" @searchPostTag="searchPostTag"></router-view>
  </div>
</template>

<script>
import Header from "./components/Header";
export default {
  data() {
    return {
      imgSrc: "",
      isReload: true,
      showHeader: true,
      postTag: "", // 要搜索的文章标签
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
    // 子组件转入标签
    searchPostTag(data) {
      this.postTag = data;
    },
  },
  watch: {
    // 监听路由的变化
    $route(to) {
      // 匹配/admin或者/admin/或者/admin/....路径
      let reg = /^\/admin|^\/admin[\/|\/\S+]/;
      if (reg.test(to.path)) {
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
