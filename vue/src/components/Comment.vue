<template>
  <div class="comment">
    <!-- 判断用户是否登录，没登录则不显示 -->
    <div class="self_comment_wrapper" v-if="isLogin">
      <!-- 自己的评价 -->
      <div class="self_comment">
        <img :src="postData.user_avatar" class="avatar" />
        <!-- textarea的评论内容 -->
        <el-input
          class="comment_textarea"
          type="textarea"
          placeholder="想对作者说的话"
          v-model="textarea"
          maxlength="1000"
          :autosize="{ minRows: 3, maxRows: 4 }"
          show-word-limit
        >
        </el-input>
      </div>
      <!-- 发表评论按钮 -->
      <div class="btn-wrapper">
        <el-button
          class="btn"
          type="danger"
          @click="addComment"
          :disabled="submitBtnDisable"
          >发表评论</el-button
        >
      </div>
    </div>
    <div class="main"></div>
    <div class="noData">
      暂无评论
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textarea: "",
      userInfo: {},
      isLogin: false,
      commentArr: [],
    };
  },
  props: {
    postData: {
      type: Object,
    },
  },
  methods: {
    initData() {
      this.initUserInfo();
    },
    // 初始化登录用户的信息
    initUserInfo() {
      let store_userInfo = this.$store.getters.getUserInfo.userInfo;
      if (store_userInfo) {
        let user_id = store_userInfo.user_id;
        let isLogin = store_userInfo.isLogin;
        this.isLogin = isLogin;
        this.$axios({
          method: "get",
          url: "/getUserInfo",
          params: {
            user_id,
          },
        })
          .then((res) => {
            if (res.data.state === 0) {
              this.userInfo = res.data.userInfo;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 添加评论
    addComment() {
      this.$axios({
        method: "post",
        url: "/addComment",
        data: {
          content: this.textarea,
        },
      })
        .then((res) => {
          if (res.data.state === 0) {
            // this.commentArr.unshift(this.textarea);
          } else if (res.data.state === 1) {
            this.$message.warning("请先登录");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    //   判断评论框里的内容是否为空，或者都是空白符，返回相应的true或false
    submitBtnDisable() {
      let reg = /^\s+$/;
      return reg.test(this.textarea) || !this.textarea ? true : false;
    },
  },
  created() {
    this.initData();
  },
};
</script>

<style scoped lang="scss">
@import "@/common/styles";
.comment {
  @include content_style;
  .self_comment_wrapper {
    .self_comment {
      display: flex;
      .avatar {
        margin: 0.5rem 0.5rem 0 0;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
      }
    }
    .btn-wrapper {
      display: flex;
      padding-top: 0.5rem;
      justify-content: flex-end;
    }
  }
  @media screen and (max-width: 768px) {
    margin-top: 1rem;
  }
}
</style>
