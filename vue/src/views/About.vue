<template>
  <div class="about">
    <div class="header">
      <!-- 头像 -->
      <div class="avatar-wrapper">
        <img class="avatar" :src="userInfo.user_avatar" alt="头像" />
      </div>
      <!-- 作者名和性别 -->
      <div class="userName">
        {{ userInfo.user_nickName }}
        <i class="el-icon-male" v-if="userInfo.user_sex === 1"></i>
        <i class="el-icon-female" v-else></i>
      </div>
      <!-- 作者的基本信息 -->
      <!-- el-collapse-transition是elementui内置的过渡动画 -->
      <el-collapse-transition>
        <div class="info" v-show="moreVisible">
          <ul>
            <li class="info-item">
              <i class="el-icon-potato-strips icon"></i>
              <span class="content">{{ userInfo.user_birthday }}</span>
            </li>
            <li class="info-item">
              <i class="el-icon-location icon"></i>
              <span class="content">{{ userInfo.user_address }}</span>
            </li>
            <li class="info-item">
              <i class="el-icon-message icon"></i>
              <span class="content">{{ userInfo.user_email }}</span>
            </li>
          </ul>
        </div>
      </el-collapse-transition>

      <!-- 查看更多资料 -->
      <div class="more" @click="lookMore">
        <i class="el-icon-arrow-down icon" ref="icon"></i>
        <span>查看详细资料</span>
      </div>

      <!-- 编辑个人资料 -->
      <div class="editData" v-if="editDataVisible">
        <el-button size="small" type="success" round>编辑个人资料</el-button>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="container">
      <!-- 文章遍历 -->
      <ul class="post-wrapper">
        <li class="post-item" v-for="(item, index) in postArr" :key="index">
          <h1 class="title">{{ item.post_title }}</h1>
          <h2 class="post_content" ref="post_content"></h2>
          <div class="post_footer">
            <!-- 过滤一下时间格式 -->
            <span class="create_time post_footer_item">{{
              item.post_createTime | changeTime
            }}</span>
            <span class="iconfont icon-zhichi post_footer_item">{{
              item.post_praise_count
            }}</span>
            <span class="iconfont icon-yuedu post_footer_item">{{
              item.post_read_count
            }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  data() {
    return {
      userInfo: {},
      postArr: [],
      moreVisible: false,
      contentSlice: 80,
      supportArr: [],
      editDataVisible: false, //编辑个人资料是否显示
    };
  },
  methods: {
    // 初始化数据
    initData(user_id) {
      return Promise.all([
        this.initData_post(user_id),
        this.initData_userInfo(user_id),
      ])
        .then((values) => {
          /**
           * state:0代表用户存在
           * state:1代表用户不存在
           */
          if (values[0].data.state === 0) {
            this.postArr = values[0].data.post;
          } else if (values[0].data.state === 1) {
            this.$router.push({ name: "errorLink" });
          }

          if (values[1].data.state === 0) {
            this.userInfo = values[1].data.userInfo;
            // 获取vuex中的用户信息，看个人中心是不是该用户的，是的话，显示编辑个人资料；不是的话则不显示
            let store_userId = this.$store.getters.getUserInfo.userInfo.user_id;
            this.userInfo.user_id === store_userId
              ? (this.editDataVisible = true)
              : (this.editDataVisible = false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 初始化指定用户的文章
    initData_post(user_id) {
      return this.$axios({
        method: "get",
        url: "/getUserPost",
        params: {
          user_id,
        },
      });
    },
    // 初始化指定用户的信息
    initData_userInfo(user_id) {
      return this.$axios({
        method: "get",
        url: "/getUserInfo",
        params: {
          user_id,
        },
      });
    },
    // 查看更多资料
    lookMore() {
      this.moreVisible = !this.moreVisible;
      this.moreVisible
        ? (this.$refs.icon.style.transform = "rotateZ(180deg)")
        : (this.$refs.icon.style.transform = "rotateZ(0)");
    },
    /**
     * 文章内容填充
     * 先把富文本编辑器的带有html标签的内容填充进去，在用innerText进行内容截取
     */
    content() {
      let arr = this.$refs.post_content;
      arr.forEach((item, index) => {
        item.innerHTML = this.postArr[index].post_content;
        // 先用正则把空格去掉，再进行截取长度，最后加上...当成省略
        item.innerText =
          item.innerText
            .replace(new RegExp("\\s", "g"), "")
            .slice(0, this.contentSlice) + "...";
      });
    },
  },
  filters: {
    // 由于从mysql数据库导过来的时间格式改变成了2020-04-01T14:59:33.000Z，所以需要过滤一下
    changeTime(val) {
      return new Date(val).toLocaleString().replace(new RegExp("/", "g"), "-");
    },
  },
  async created() {
    // 把动态路由传的参数id给initPost，获取用户文章
    await this.initData(this.$route.params.id);
    this.content();
  },
  components: {},
};
</script>

<style scoped lang="scss">
@import "../common/styles";
.about {
  .header {
    margin: 1rem auto 0;
    padding-bottom: 1rem;
    width: 60%;
    background-color: $div_bgColor;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    background: url("./../assets/poster.jpg") no-repeat;
    background-size: 100% 100%;
    .avatar-wrapper {
      padding: 2rem 0 1rem;
      text-align: center;
      .avatar {
        padding: 0.2rem;
        width: 7rem;
        border-radius: 50%;
        background: $diy_gary;
        box-sizing: border-box;
        &:hover {
          transition: all 1.2s cubic-bezier(0.61, 0.01, 0.7, 1.72);
          transform: rotateZ(360deg);
        }
      }
    }
    .userName {
      padding-bottom: 0.8rem;
      text-align: center;
      font-size: 1.2rem;
      color: $div_bgColor;
      .el-icon-male,
      .el-icon-female {
        display: inline-block;
        border-radius: 50%;
        font-weight: 500;
      }
      .el-icon-male {
        background: $diy_blue;
      }
      .el-icon-female {
        background: $tb_color;
      }
    }
    // 作者信息
    .info {
      margin: 1rem auto;
      padding: 0.3rem 0;
      text-align: center;
      font-size: 1rem;
      color: $diy_gary;
      background: $div_bgColor;
      border-radius: 5px;
      .info-item {
        line-height: 1.3rem;
        box-sizing: border-box;
        .icon {
          padding-right: 1rem;
          color: $diy_gary;
        }
      }
    }
    // 更多资料
    .more {
      text-align: center;
      color: $bgColor;
      &:hover {
        cursor: pointer;
      }
      .icon {
        padding-right: 0.2rem;
        transition: all 0.5s linear;
      }
    }
    // 编辑个人资料
    .editData {
      display: flex;
      padding: 1rem 1rem 0 1rem;
      justify-content: center;
    }
  }
  .container {
    margin: 1rem auto 0;
    width: 60%;
    background-color: $div_bgColor;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    padding: 1rem;
    box-sizing: border-box;
    .post-wrapper {
      // 文章样式
      .post-item {
        padding: 0.5rem;
        border-radius: 5px;
        border-bottom: $border_bottom;
        .title {
          font-size: 1.3rem;
          padding-bottom: 1rem;
          &:hover {
            color: $tb_color;
          }
        }
        .post_content {
          color: $diy_gary;
          padding-bottom: 1rem;
          font-size: 1rem !important;
          line-height: 1.2rem;
          overflow: hidden;
        }
        // 时间，点赞和阅读量的样式
        .post_footer {
          color: $diy_gary;
          font-size: 0.8rem;
          .post_footer_item {
            padding-right: 1rem;
            &::before {
              padding-right: 0.3rem;
            }
            &:nth-child(1),
            &:nth-child(2) {
              &::after {
                display: inline-block;
                vertical-align: top;
                padding-left: 1rem;
                box-sizing: border-box;
                content: "|";
                font-size: 0.8rem;
                color: $diy_gary;
                opacity: 0.3;
              }
            }
          }
        }
        &:hover {
          cursor: pointer;
          background: rgba(82, 81, 81, 0.1);
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    .header {
      width: 100%;
      margin: 0;
    }
    .container {
      width: 100%;
    }
  }
}
</style>
