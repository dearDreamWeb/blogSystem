<template>
  <div class="admin">
    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <img src="../assets/images/admin_logo.png" alt="logo" class="logo" />
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
        <el-aside width="200px" class="left_aside">
          <ul>
            <li v-for="(item, index) in navData" :key="index" class="nav">
              <!-- 一级导航 -->
              <div
                :class="['nav_main', { active: activeIndex === item.index }]"
                @click="activeIndex = item.index"
              >
                <router-link
                  :to="item.subnav ? '' : item.path"
                  class="nav_title"
                >
                  <div>
                    <i :class="item.icon"></i>
                    {{ item.title }}
                  </div>
                  <!-- 判断是否选中在当前一级导航或子导航，添加样式 -->
                  <i
                    v-if="item.subnav"
                    :class="[
                      'el-icon-caret-right',
                      'icon',
                      {
                        activeIcon:
                          activeIndex === item.index ||
                          item.index === activeIndex[0],
                      },
                    ]"
                  ></i
                ></router-link>
              </div>
              <!-- 判断有没有二级导航  引入transition动画-->
              <div v-if="item.subnav">
                <transition
                  name="fade"
                  enter-active-class="animate__animated animate__fadeIn"
                  leave-active-class="animate__animated animate__slideOutUp"
                  :duration="{ enter: 200, leave: 300 }"
                >
                  <!-- 判断是否选中在当前一级导航或子导航，来决定是否显示子导航 -->
                  <ul
                    v-show="
                      activeIndex === item.index ||
                        item.index === activeIndex[0]
                    "
                    class="subnav"
                  >
                    <li
                      v-for="(subItem, subIndex) in item.subnav"
                      :key="subIndex"
                      :class="[
                        'subnav_main',
                        { active: activeIndex === subItem.index },
                      ]"
                      @click="activeIndex = subItem.index"
                    >
                      <router-link :to="subItem.path" class="subnav_title">{{
                        subItem.title
                      }}</router-link>
                    </li>
                  </ul>
                </transition>
              </div>
            </li>
          </ul>
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
    .logo {
      height: 100%;
    }
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
      .nav {
        .nav_main {
          padding: 20px;
          .nav_title {
            display: flex;
            justify-content: space-between;
            color: $div_bgColor;
            .icon {
              transition: all 0.5s linear;
              &::before {
                color: $div_bgColor;
              }
            }
            .activeIcon {
              transform: rotateZ(90deg);
            }
          }
          &:hover {
            cursor: pointer;
            background: $green;
          }
        }
        // 点击样式
        .active {
          background: $green;
        }
        //  二级导航
        .subnav {
          .subnav_main {
            padding: 20px 30px;
            &:hover {
              cursor: pointer;
              background: $green;
              .subnav_title {
                display: inline-block;
                width: 100%;
                height: 100%;
                color: $div_bgColor;
              }
            }
          }
          .active {
            background: $green;
            .subnav_title {
              display: inline-block;
              width: 100%;
              height: 100%;
              color: $div_bgColor;
            }
          }
        }
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
