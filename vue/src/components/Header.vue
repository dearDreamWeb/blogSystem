<template>
  <el-row class="header">
    <!-- logog -->
    <el-col :xs="4" :sm="8" class="logo-wrapper">
      <router-link :to="{ name: 'homeLink' }">
        <img src="../assets/images/logo.png" class="logo" />
      </router-link>
    </el-col>

    <!-- 搜索 -->
    <el-col :xs="14" :sm="8" class="search-wrapper">
      <el-input
        type="text"
        class="search"
        placeholder="搜索文章标题、文章内容或文章标签"
        v-model="searchVal"
        clearable
        @keydown.enter.native="searchPost"
      ></el-input>
      <el-button type="primary" class="search-btn" @click="searchPost"
        ><i class="el-icon-search"></i>
        <!-- 小屏幕的时候隐藏 -->
        <span class="hidden-xs-only">搜索</span></el-button
      >
    </el-col>

    <!-- 登录成功显示昵称，头像和注销 -->
    <el-col :xs="6" :sm="8" class="user" v-if="isLogin">
      <!-- 消息中心图标 -->
      <el-badge :hidden="!messageCount" :value="messageCount" :max="99">
        <i
          @click="$router.push('/messageCenter')"
          :class="[
            'el-icon-message-solid',
            'default_msg',
            messageCount ? 'hasMsg' : '',
          ]"
        ></i>
      </el-badge>
      <!-- 当小屏时，隐藏 -->
      <span class="userName hidden-xs-only">{{ userInfo.user_nickName }}</span>
      <!-- 弹出框，可以选择个人中心还是写文章 -->
      <el-popover placement="bottom" trigger="hover">
        <ul class="popover-content">
          <li @click="jumpAbout">
            个人中心
          </li>
          <li>
            <router-link :to="{ name: 'editPostLink' }">写文章</router-link>
          </li>
        </ul>
        <img
          slot="reference"
          :src="userInfo.user_avatar"
          alt="头像"
          class="avatar"
        />
      </el-popover>
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
  inject: ["reload"], //刷新页面
  props: {
    postTag: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchVal: "",
      loginVisible: false,
      registerVisible: false,
      messageCount: 0,
    };
  },
  methods: {
    // 初始化数据
    async initData() {
      // 判断当注销过用户信息后不调用getUserInfo方法
      let userInfo = this.$store.getters.getUserInfo;
      userInfo && this.getUserInfo();
    },

    // 搜索标签 如果当前路由在searchLink时，输入框里填充搜索的值
    searchPostTag() {
      if (this.postTag !== "") {
        this.searchVal = this.postTag;
        this.searchPost();
      }
      if (this.$route.name === "searchLink") {
        this.searchVal = this.$route.params.content;
      }
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
      this.$axios({
        method: "get",
        url: "/getUserInfo",
      })
        .then(res => {
          if (res.data.state === 0) {
            this.messageCount = res.data.userInfo.unReadCount;
            this.$store.commit("setUserInfo", res.data.userInfo);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**
     * 注销
     * 成功后将sessionStorage中的用户数据清空
     * 返回首页
     */

    loginOut() {
      this.$axios({
        method: "get",
        url: "/loginOut",
      })
        .then(res => {
          if (res.data.state === 0) {
            this.$message.success("注销成功");
            this.$store.commit("loginOut");
            this.$router.push({ name: "homeLink" }).catch(() => {
              this.reload();
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**
     * 跳转到个人中心
     */
    jumpAbout() {
      this.$router.push({
        name: "aboutLink",
        params: { id: this.userInfo.user_id },
      });
      this.reload();
    },

    /**
     * 跳转到home界面
     * 搜索文章标题或者内容
     */
    searchPost() {
      if (this.searchVal !== this.postTag) {
        this.$emit("searchPostTag", "");
      }
      this.$router.push({
        name: "searchLink",
        params: {
          content: this.searchVal,
        },
      });
      this.reload();
    },
  },
  computed: {
    isLogin() {
      return this.$store.getters.getUserInfo.isLogin;
    },
    userInfo() {
      return this.$store.getters.getUserInfo || {};
    },
  },
  created() {
    this.initData();
    setTimeout(() => {
      this.searchPostTag();
    }, 300);
  },
  watch: {
    // 监听postTag，赋值给searchVal
    postTag() {
      if (this.postTag !== "") {
        this.searchVal = this.postTag;
        this.searchPost();
      }
    },
    // 通过路由监听，当路由从searchLink到homeLink时，搜索所有文章
    $route(to, from) {
      if (from.name === "searchLink" && to.name === "homeLink") {
        this.searchVal = "";
        this.searchPost();
      }
    },
    userInfo() {
      this.messageCount = this.userInfo.unReadCount;
    },
  },
  components: {
    vLogin: Login,
    vRegister: Register,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../common/styles";
.header {
  width: 100%;
  height: 60px;
  padding: 0.5rem 2rem;
  background-color: $div_bgColor;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  .logo-wrapper {
    height: 100%;
    .logo {
      height: 100%;
    }
  }
  .search-wrapper {
    display: flex;
    .search-btn {
      margin-left: 0.6rem;
    }
  }
  .user {
    display: flex;
    height: 100%;
    justify-content: flex-end;
    align-items: center;
    ::v-deep .el-badge {
      position: relative;
      &:hover {
        &::after {
          content: "消息中心";
          display: block;
          position: absolute;
          left: 50%;
          bottom: -25px;
          margin-left: -25px;
          padding: 5px 10px;
          min-width: 50px;
          font-size: 12px;
          text-align: center;
          border-radius: 3px;
          color: $div_bgColor;
          background-color: rgba(0, 0, 0, 0.5);
        }
      }
      .el-badge__content {
        right: 30px;
      }
    }
    .default_msg {
      padding: 0 20px 0 5px;
      font-size: 20px;
      color: $diy_gary;
      cursor: pointer;
      &.hasMsg {
        color: $tb_color;
      }
    }
    .avatar {
      margin: 0 0.5rem;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      object-fit: cover;
      &:hover {
        cursor: pointer;
      }
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

// 改变element组件的样式
.popover-content {
  li {
    &:hover {
      cursor: pointer;
      color: $tb_color;
    }
  }
}
</style>
