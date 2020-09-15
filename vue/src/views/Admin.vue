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
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px" class="aside">
          <ul>
            <li
              v-for="(item, index) in mavData"
              :key="index"
              class="nav"
              @click="activeIndex = item.index"
            >
              <!-- 一级导航 -->
              <div class="nav_main">
                <router-link
                  :to="item.subnav ? '' : item.path"
                  class="nav_title"
                  >{{ item.title }}</router-link
                >
                <i
                  :class="[
                    'el-icon-caret-right icon',
                    { active: activeIndex === item.index },
                  ]"
                ></i>
              </div>
              <!-- 判断有没有二级目录 -->
              <div v-if="item.subnav">
                <transition
                  name="fade"
                  enter-active-class="animate__animated animate__fadeIn"
                  leave-active-class="animate__animated animate__fadeOut"
                  :duration="{ enter: 300, leave: 300 }"
                >
                  <ul v-show="activeIndex === item.index" class="subnav">
                    <li
                      v-for="(subItem, subIndex) in item.subnav"
                      :key="subIndex"
                      class="subnav_main"
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
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 导航信息
      mavData: [
        {
          index: "1",
          title: "首页",
          path: "/admin/home",
        },
        {
          index: "2",
          title: "文章",
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
  methods: {},
  mounted() {
    // console.log(this.$route);
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
  //   侧边导航栏
  .aside {
    padding: 20px 0;
    height: 100vh;
    background: $deep_black;
    .nav {
      .nav_main {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        .nav_title {
          color: $div_bgColor;
        }
        .icon {
          transition: all 0.5s linear;
          &::before {
            color: $div_bgColor;
          }
        }
        .active {
          transform: rotateZ(90deg);
        }

        &:hover {
          cursor: pointer;
          background: $green;
        }
      }
      //  二级导航
      .subnav {
        .subnav_main {
          padding: 20px 30px;
          &:hover {
            cursor: pointer;
            background: $green;
            .subnav_title {
              color: $div_bgColor;
            }
          }
        }
      }
    }
  }
}
</style>
