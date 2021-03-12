<template>
  <div class="comment">
    <!-- 判断用户是否登录，没登录则不显示 -->
    <div class="self_comment_wrapper" v-if="isLogin">
      <!-- 自己的评价 -->
      <div class="self_comment">
        <img :src="userInfo.user_avatar" class="avatar" />
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
    <div class="main" v-if="commentArr.length > 0">
      <ul>
        <li v-for="(item, index) in commentArr" :key="index" class="item">
          <img :src="item.user_avatar" class="avatar" />
          <span
            class="name"
            @click="
              $router.push({
                name: 'aboutLink',
                params: { id: item.user_id },
              })
            "
            >{{ item.user_nickName }}</span
          >
          <span class="time">{{ item.comment_createTime | handleDate }}</span>
          <div class="comment_conetent">{{ item.comment_content }}</div>
        </li>
      </ul>
    </div>
    <div class="noData" v-else>暂无评论</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textarea: "",
      userInfo: {},
      commentArr: [],
    };
  },
  props: {
    postData: {
      type: Object,
    },
  },
  methods: {
    // 初始化数据
    initData() {
      this.initUserInfo();
      this.initComment();
    },

    // 初始化登录用户的信息
    initUserInfo() {
      let store_userInfo = this.$store.getters.getUserInfo;
      if (store_userInfo) {
        this.userInfo = store_userInfo;
      }
    },

    // 初始化评论区内容
    initComment() {
      this.$axios({
        method: "post",
        url: "/getComment",
        data: {
          post_id: this.$route.params.post_id,
        },
      })
        .then(res => {
          if (res.data.state === 0) {
            this.commentArr = res.data.commentData;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 添加评论
    addComment() {
      this.$axios({
        method: "post",
        url: "/addComment",
        data: {
          content: this.textarea,
          post_id: this.$route.params.post_id,
        },
      })
        .then(res => {
          if (res.data.state === 0) {
            this.commentArr.unshift(res.data.commentData);
            this.$message.success("发表评论成功");
            this.textarea = "";
          } else if (res.data.state === 1) {
            this.$message.warning("请先登录");
          }
        })
        .catch(err => {
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
    isLogin() {
      return this.$store.getters.getUserInfo.isLogin;
    },
  },
  filters: {
    // 格式化时间差
    handleDate(val) {
      let nowDate = new Date().getTime(); //现在的时间
      let commentDate = new Date(val).getTime(); // 评论的时间
      let timeValue = nowDate - commentDate; // 时间差的毫秒数
      // 接下来分别把时间差的毫秒数转换成年、月、天、小时、分钟、秒
      let years = Math.floor(timeValue / (24 * 3600 * 1000 * 365));
      let months = Math.floor(timeValue / (24 * 3600 * 1000 * 30));
      let days = Math.floor(timeValue / (24 * 3600 * 1000));
      let hours = Math.floor(timeValue / (3600 * 1000));
      let minutes = Math.floor(timeValue / (60 * 1000));
      let seconds = Math.floor(timeValue / 1000);
      let arr = [years, months, days, hours, minutes, seconds];
      let arr1 = ["年前", "月前", "天前", "小时前", "分钟前", "秒前", "刚刚"];
      let index = 6;
      let over = true;
      // 遍历arr，判断哪一项不为0就用over=false进行停止index的赋值操作
      // 最后return返回正确的时间差的值
      arr.forEach((item, i) => {
        if (item && over) {
          index = i;
          over = false;
        }
      });
      if (index === 6) {
        return `${arr1[index]}`;
      } else {
        return `${arr[index]}${arr1[index]}`;
      }
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
  .main {
    .item {
      padding-bottom: 1rem;
      border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
      .avatar {
        margin: 0.5rem 0.5rem 0 0;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
      }
      .name {
        display: inline-block;
        vertical-align: text-bottom;
        height: 2rem;
        padding-right: 1rem;
        font-weight: 500;
        cursor: pointer;
        &:hover {
          color: rgb(8, 199, 189);
        }
      }
      .time {
        display: inline-block;
        vertical-align: text-bottom;
        height: 2rem;
        font-size: 0.7rem;
        color: $diy_gary;
      }
      .comment_conetent {
        padding-top: 0.5rem;
        margin-left: 2.5rem;
        color: $diy_darkGary;
      }
    }
  }
  .noData {
    font-size: 3rem;
    color: $diy_gary;
  }
  @media screen and (max-width: 768px) {
    margin-top: 1rem;
  }
}
</style>
