<template>
  <div class="admin">
    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <!-- 左边 -->
        <div class="left">
          <img src="../assets/images/admin_logo.png" alt="logo" class="logo" />
          <!-- 开关 -->
          <el-switch
            v-model="isCollapse"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </div>
        <!-- 右边 -->
        <div class="right">
          <!-- 下拉菜单 -->
          <el-dropdown class="dropdown">
            <span class="el-dropdown-link">
              {{ adminUsername }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="loginOut()"
                >注销</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <router-link to="/" class="reception_home">前台首页</router-link>
        </div>
      </el-header>
      <!-- 主体部分 -->
      <el-container class="container">
        <!-- 侧边栏 -->
        <el-aside width="auto" class="left_aside">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
          >
            <div v-for="(item, index) in navData" :key="index">
              <!-- 
                一级导航 
                使用了v-if和v-else，
                因为没有二级导航的话一级导航直接使用el-menu-item；
                有二级导航的话一级导航用el-sumenu
              -->
              <el-submenu
                v-if="item.subnav"
                :index="item.index"
                @click="jumpRouter(item.index, item.path)"
              >
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{ item.title }}</span>
                </template>
                <!-- 二级导航 -->
                <template v-if="item.subnav">
                  <el-menu-item
                    v-for="(subItem, subIndex) in item.subnav"
                    :key="subIndex"
                    :index="subItem.index"
                    @click="jumpRouter(subItem.index, subItem.path)"
                    >{{ subItem.title }}
                  </el-menu-item>
                </template>
              </el-submenu>
              <!-- 没有二级导航的样式 -->
              <el-menu-item
                v-else
                :index="item.index"
                @click="jumpRouter(item.index, item.path)"
              >
                <i :class="item.icon"></i>
                <span slot="title">{{ item.title }}</span>
              </el-menu-item>
            </div>
          </el-menu>
        </el-aside>
        <!-- 右侧内容区 -->
        <el-main class="right_content" @scroll.stop="">
          <!-- 面包屑导航 -->
          <el-breadcrumb separator="/" class="breadcrumb_wrap">
            <el-breadcrumb-item
              v-for="(item, index) in breadcrumbData"
              :key="index"
              >{{ item }}</el-breadcrumb-item
            >
          </el-breadcrumb>
          <!-- 子路由 -->
          <div class="view_wrap">
            <router-view
              :adminUsername="adminUsername"
              :isSuperAdmin="isSuperAdmin"
            ></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 导航信息
      navData: [
        {
          index: "1",
          title: "首页",
          path: "/admin/home",
          icon: "el-icon-house",
        },
        {
          index: "2",
          title: "内容系统",
          icon: "el-icon-files",
          subnav: [
            {
              index: "2-1",
              title: "文章列表",
              path: "/admin/post_lists",
            },
            {
              index: "2-2",
              title: "评论列表",
              path: "/admin/comments_lists",
            },
          ],
        },
        {
          index: "3",
          title: "用户系统",
          icon: "el-icon-user",
          subnav: [
            {
              index: "3-1",
              title: "网站用户",
              path: "/admin/users",
            },
            {
              index: "3-2",
              title: "后台管理员",
              path: "/admin/admin_users",
            },
          ],
        },
      ],
      activeIndex: "1", // 当前访问的导航
      isCollapse: false, // 是否折叠左侧导航栏
      adminUsername: "", // 管理员名字
      isSuperAdmin: false, // 是否是超级管理员
    };
  },
  methods: {
    // 初始化当前导航，根据路由判断在哪个导航
    initActiveIndex() {
      let nowPath = this.$route.path;
      this.navData.forEach(item => {
        if (item.path === nowPath) {
          this.activeIndex = item.index;
          return;
        }
        if (item.subnav) {
          item.subnav.forEach(subItem => {
            if (subItem.path === nowPath) {
              this.activeIndex = subItem.index;
              return;
            }
          });
        }
      });
    },
    // 改变当前路由和选择导航
    jumpRouter(index, path) {
      this.activeIndex = index;
      if (!path) return;
      this.$router.push(path);
    },

    // 退出登录
    loginOut() {
      this.$axios({
        method: "get",
        url: "/admin/loginOut",
      })
        .then(res => {
          if (res.data.status === 0) {
            this.$store.commit("setAdminUsername", "");
            this.$message.success("管理注销成功");
            this.$router.push("/");
          }
        })
        .catch(err => console.log(err));
    },

    // 判断管理是否已登录
    adminIsLogin() {
      this.$axios({
        method: "get",
        url: "/admin/isLogin",
      })
        .then(res => {
          if (res.data.status === 0) {
            this.$store.commit("setAdminUsername", res.data.adminUsername);
            this.adminUsername = res.data.adminUsername;
            this.isSuperAdmin = res.data.category;
          } else {
            this.$message.info(res.data.mess);
            this.$router.push("/");
          }
        })
        .catch(err => console.log(err));
    },
    // 获取用户数据
  },
  computed: {
    // 面包屑的导航信息
    breadcrumbData() {
      let navArr = [];
      // 得到当前导航的一级导航和二级导航
      let arr = this.navData.filter(item => {
        return item.index === this.activeIndex[0];
      });
      navArr.push(arr[0].title);
      if (arr[0].subnav) {
        let arr1 = arr[0].subnav.filter(
          item => item.index === this.activeIndex
        );
        navArr.push(arr1[0].title);
      }
      return navArr;
    },
  },
  mounted() {
    this.initActiveIndex();
    this.adminIsLogin();
  },
  // 路由拦截
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let adminUsername = vm.$store.getters.getAdminUsername;
      if (!adminUsername) {
        vm.$message.info("管理员未登录，请先登录");
        vm.$router.push("/");
        return false;
      }
    });
  },
};
</script>
<style lang="scss" scoped>
@import "../common/styles/index.scss";
.admin {
  // overflow: hidden;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-image: linear-gradient(-20deg, #d558c8 0%, #24d292 100%);
    // 头部左边
    .left {
      display: flex;
      align-items: center;
      height: 100%;
      .logo {
        margin-right: 50px;
        height: 100%;
      }
    }
    // 头部右边
    .right {
      .dropdown {
        color: $div_bgColor;
        &:hover {
          cursor: pointer;
        }
      }
      .reception_home {
        padding-left: 20px;
        font-size: 14px;
        color: $div_bgColor;
      }
    }
  }
  .container {
    //   左侧导航栏
    .left_aside {
      padding: 20px 0;
      height: calc(100vh - 60px);
      background: $deep_black;
      .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        // min-height: 400px;
      }
    }

    @media screen and (max-width: 768px) {
      display: flex;
      flex-direction: column;
      .left_aside {
        width: 100vw !important;
        height: auto;
      }
    }
    // 右侧内容区
    .right_content {
      padding: 0;
      background-color: $bgColor;
      height: calc(100vh - 60px);
      .breadcrumb_wrap {
        padding: 20px 20px;
        background-color: $div_bgColor;
        border-bottom: $border_bottom;
      }
      .view_wrap {
        padding: 20px;
      }
    }
  }
}
</style>
