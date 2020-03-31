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
        <!-- 小屏幕的时候隐藏 -->
        <span class="hidden-xs-only">搜索</span></el-button
      >
    </el-col>

    <!-- 登录成功显示昵称，头像和注销 -->
    <el-col :xs="6" :sm="8" class="user" v-if="isLogin">
      <span class="userName hidden-xs-only">{{ userInfo.user_nickName }}</span>
      <img :src="userInfo.user_avatar" alt="头像" class="avatar" />
      <span class="loginOut" @click="loginOut">注销</span>
    </el-col>
    <!-- 登录和注册 -->
    <el-col :xs="6" :sm="8" class="user" v-else>
      <el-button type="text" @click="loginVisible = true">登录</el-button>
      <el-button type="text" @click="registerVisible = true">注册</el-button>
    </el-col>

    <!-- 登录模态框 -->
    <v-login
      :loginVisible="loginVisible"
      @changeLoginVisible="changeLoginVisible"
      @userIsLogin="userIsLogin"
    ></v-login>

    <!-- 注册模态框 -->
    <v-register
      :registerVisible="registerVisible"
      @changeRegisterVisible="changeRegisterVisible"
    ></v-register>
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
      registerVisible: false,
      isLogin: false,
      userInfo: {}
    };
  },
  methods: {
    // 初始化数据
    initData() {
      // 判断当注销过用户信息后不调用getUserInfo方法
      let userInfo = this.$store.getters.getUserInfo;
      userInfo.userInfo && this.getUserInfo();
    },

    // 接收子组件的自定义事件关闭模态框
    changeLoginVisible(val) {
      this.loginVisible = val;
    },

    // 接收子组件的自定义事件关闭模态框
    changeRegisterVisible(val) {
      this.registerVisible = val;
    },

    // 用户登录成功，获取用户的信息
    userIsLogin() {
      this.getUserInfo();
    },

    // 获取用户数据
    getUserInfo() {
      let userInfo = this.$store.getters.getUserInfo;
      let user_id = userInfo.userInfo.user_id;
      let isLogin = userInfo.userInfo.isLogin;
      this.isLogin = isLogin;
      this.$axios({
        method: "get",
        url: "/getUserInfo",
        params: {
          user_id
        }
      })
        .then(res => {
          if (res.data.state === 0) {
            this.userInfo = res.data.userInfo;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 注销 成功后将sessionStorage中的用户数据清空
    loginOut() {
      this.$axios({
        method: "get",
        url: "/loginOut"
      })
        .then(res => {
          if (res.data.state === 0) {
            this.$message.success("注销成功");
            window.sessionStorage.removeItem("userInfo");
            this.isLogin = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.initData();
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
    align-items: center;
    .avatar {
      padding: 0 0.5rem;
      width: 2rem;
      border-radius: 50%;
    }
    .userName,
    .loginOut {
      color: $diy_gary;
    }
    .loginOut {
      &:hover {
        color: $tb_color;
        cursor: pointer;
      }
    }
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
