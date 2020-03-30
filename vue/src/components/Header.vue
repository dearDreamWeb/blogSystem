<template>
  <el-row class="header">
    <!-- logog -->
    <el-col :xs="4" :sm="8" class="logo-wrapper">
      <router-link :to="{ name: 'homeLink' }">
        <img src="../assets/logo.svg" class="logo" />
      </router-link>
    </el-col>

    <!-- 搜索 -->
    <el-col :xs="14" :sm="8" class="search-wrapper">
      <el-input
        type="text"
        class="search"
        placeholder="搜索文章标题"
        v-model="searchVal"
        clearable
      ></el-input>
      <el-button type="primary" class="search-btn"
        ><i class="el-icon-search"></i>
        <span class="hidden-xs-only">搜索</span></el-button
      >
    </el-col>

    <!-- 登录和注册 -->
    <el-col :xs="6" :sm="8" class="user">
      <el-button type="text" @click="loginVisible = true">登录</el-button>
      <el-button type="text" @click="registerVisible = true">注册</el-button>
    </el-col>

    <!-- 登录模态框 -->
    <v-login :loginVisible = "loginVisible" @changeLoginVisible = "changeLoginVisible"></v-login>

    <!-- 注册模态框 -->
    <v-register :registerVisible = "registerVisible" @changeRegisterVisible = "changeRegisterVisible"></v-register>
  </el-row>
</template>

<script>
import Login from "./Login";
import Register from "./Register";

export default {
  name: "Header",
  data() {
    return {
      searchVal: "",
      loginVisible: false,
      registerVisible: false
    };
  },
  methods: {
    // 接收子组件的自定义事件关闭模态框
    changeLoginVisible(val) {
      this.loginVisible = val;
    },

    // 接收子组件的自定义事件关闭模态框
    changeRegisterVisible(val) {
      this.registerVisible = val;
    }
  },
  components: {
    vLogin: Login,
    vRegister: Register
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../common/styles";
.header {
  width: 100%;
  padding: 0.5rem 2rem;
  background-color: $div_bgColor;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);

  .search-wrapper {
    display: flex;
    .search-btn {
      margin-left: 0.6rem;
    }
  }
  .user {
    display: flex;
    justify-content: flex-end;
  }
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    .logo-wrapper {
      padding: 0 0.2rem 0 0;
      .logo {
        width: 100%;
      }
    }
  }
}
</style>
