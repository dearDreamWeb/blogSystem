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
              admin<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>注销</el-dropdown-item>
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
            :unique-opened="true"
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
        <el-main class="right_conent">
          <router-view></router-view>
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
          title: "文章",
          icon: "el-icon-files",
          subnav: [
            {
              index: "2-1",
              title: "文章列表",
              path: "/admin/post_lists",
            },
          ],
        },
        {
          index: "3",
          title: "用户",
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

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  mounted() {
    this.initActiveIndex();
  },
};
</script>
<style lang="scss" scoped>
@import "../common/styles/index.scss";
.admin {
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
      height: 100vh;
      background: $deep_black;
      // .el-menu {
      //   width: 50px;
      // }
      .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        // min-width: 400px;
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
  }
}
</style>
