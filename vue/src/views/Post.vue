<template>
  <div class="post">
    <div class="container" ref="container">
      <!-- 头部 -->
      <div class="post_header">
        <el-page-header
          @back="$router.back(-1)"
          class="title"
          :content="postData.post_title"
        >
        </el-page-header>
        <div class="info">
          <!-- 点击作者头像或者名字跳转作者的个人中心 -->
          <div
            class="userName item"
            @click="
              $router.push({
                name: 'aboutLink',
                params: { id: postData.user_id },
              })
            "
          >
            {{ postData.user_nickName }}
          </div>
          <div class="createTime item">
            <!-- 过滤一下时间格式 -->
            <span class="text">发布于</span
            >{{ postData.post_createTime | changeTime }}
          </div>
          <div class="readCount item">
            <span class="text">阅读数</span>{{ postData.post_read_count }}
          </div>
          <router-link
            v-if="postData.post_masterId===getUserId"
            class="edit_btn item"
            :to="`/editPost/${postData.post_id}`"
            >编辑</router-link
          >
        </div>
      </div>
      <!-- 主体 -->
      <div class="main">
        <!-- 内容区 -->
        <div class="content" ref="post_content"></div>
        <!-- 底部 -->
        <div class="main_footer">
          <!-- 点赞按钮 -->
          <el-button
            class="btn"
            :class="{ support: already_parise }"
            plain
            @click="toggleClass"
            ><span class="iconfont icon-zhichi">点赞</span
            >{{ postData.post_praise_count }}</el-button
          >
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <v-comment :postData="postData"></v-comment>

    <!-- 回到顶部 -->
    <back-top></back-top>
  </div>
</template>

<script>
import Comment from "@/components/Comment";
import BackTop from "@/components/BackTop";

export default {
  data() {
    return {
      postData: {},
      already_parise: false, //是否点赞过了
      user_id: "",
    };
  },
  methods: {
    // 初始化数据
    async initData(post_id) {
      await this.initPostData(post_id);
      this.content();
      this.initSupport();
    },
    // 初始化文章数据
    initPostData(post_id) {
      return this.$axios({
        method: "get",
        url: "/get_post",
        params: {
          post_id,
        },
      })
        .then(res => {
          if (res.data.state === 0) {
            this.postData = res.data.postData;
          } else if (res.data.state === 1) {
            this.$router.push({ name: "errorLink" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 初始化点赞
     */
    initSupport() {
      this.$axios({
        method: "get",
        url: "/getSupportArr",
      })
        .then(res => {
          if (res.data.state === 0) {
            // 判断用户的点过赞的文章中是否有该文章，有的话already_parise为true，没有为false
            this.already_parise = res.data.arr.includes(
              this.$route.params.post_id
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 记录是否点过赞
     * 如果点过赞则设为未赞样式，
     * 为点过赞设为点赞样式
     */
    toggleClass() {
      let userInfo = this.$store.getters.getUserInfo;
      if (!userInfo.isLogin) {
        this.$message.warning("请先登录");
        return;
      }
      this.$axios({
        method: "get",
        url: "/addSupport",
        params: {
          post_id: this.$route.params.post_id,
          from_id: userInfo.user_id,
          to_id: this.postData.user_id,
          post_title: this.postData.post_title,
        },
      })
        .then(res => {
          /**
           * state为0代表取消点赞
           * state为1代表点赞
           * state为2代表未登录
           */
          switch (res.data.state) {
            case 0:
              this.already_parise = false;
              this.postData.post_praise_count--;
              break;
            case 1:
              this.already_parise = true;
              this.postData.post_praise_count++;
              break;
            case 2:
              this.$message.warning("请先登录");
              break;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 文章内容填充
     * 并设置图片的大小最大为container的宽度，防止图片超出容器
     */
    content() {
      let wrapper = this.$refs.post_content;
      wrapper.innerHTML = this.postData.post_content;
      let imgArr = Array.from(document.querySelectorAll("img"));
      imgArr.forEach(item => {
        item.style.maxWidth = window.getComputedStyle(
          this.$refs.container
        ).width;
      });
    },
  },
  computed: {
    // 获取用户id
    getUserId() {
      return this.$store.getters.getUserInfo.user_id;
    },
  },
  created() {
    this.initData(this.$route.params.post_id);
  },
  filters: {
    // 由于从mysql数据库导过来的时间格式改变成了2020-04-01T14:59:33.000Z，所以需要过滤一下
    changeTime(val) {
      return new Date(val).toLocaleString().replace(new RegExp("/", "g"), "-");
    },
  },
  components: {
    vComment: Comment,
    BackTop,
  },
};
</script>

<style scoped lang="scss">
@import "@/common/styles";
.post {
  .container {
    @include content_style;
    overflow-x: hidden;
    //   头部
    .post_header {
      border-bottom: $border_bottom;
      //   标题
      .title {
        font-size: 1.7rem;
        padding-bottom: 1rem;
        ::v-deep .el-page-header__left {
          &:hover {
            color: $diy_blue;
          }
        }
      }
      .info {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 1rem;
        .item {
          line-height: 1.2rem;
          padding-right: 1rem;
          font-size: 0.8rem;
          color: $diy_gary;
          .text {
            padding-right: 0.5rem;
          }
        }
        .edit_btn {
          color: $diy_blue;
        }
        .userName {
          color: $diy_blue;
          @include hover_style;
        }
      }
      @media screen and (max-width: 768px) {
        .title {
          font-size: 1.3rem;
        }
      }
    }
    //   主体
    .main {
      // 内容
      .content {
        padding: 1rem 0 2rem;
        line-height: 1.5rem;
        color: $diy_gary;
      }
      // 主体区底部
      .main_footer {
        // 点赞按钮初始样式
        .btn {
          background: $bgColor;
          border: none;
          .icon-zhichi {
            padding-right: 0.5rem;
            &::before {
              padding-right: 0.5rem;
            }
          }
          &:hover {
            border: none;
            background: $tb_color;
            color: $div_bgColor;
          }
        }
        //  点赞样式
        .support {
          color: $jd_color;
        }
      }
    }
  }
}
</style>
