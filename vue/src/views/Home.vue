<template>
  <div class="home">
    <div class="container">
      <ul class="post-wrapper">
        <li class="post-item" v-for="(item, index) in allPost" :key="index">
          <h1 class="title">{{ item.post_title }}</h1>
          <h2 class="post_content" ref="post_content"></h2>
          <div class="post_footer">
            <img class="avatar" :src="item.user_avatar" alt="头像" />
            <span class="userName">{{ item.user_nickName }}</span>
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
      allPost: []
    };
  },
  methods: {
    // 初始化数据
    initData() {
      this.$axios({
        method: "post",
        url: "/get_allPost"
      })
        .then(res => {
          if (res.data.state === 0) {
            this.allPost = res.data.allPost;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 文章内容填充
    content() {
      setTimeout(() => {
        let arr = this.$refs.post_content;
        arr.forEach((item, index) => {
          item.innerHTML = this.allPost[index].post_content;
        });
      }, 300);
    }
  },
  created() {
    this.initData();
    this.content();
  },
  components: {}
};
</script>

<style lang="scss" scoped>
@import "../common/styles";
.home {
  .container {
    margin: 0 auto;
    width: 60%;
    background-color: $div_bgColor;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    padding: 1rem;
    .post-wrapper {
      .post-item {
        padding: 0.5rem;
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
        }
        .post_footer {
          .avatar {
            width: 1.5rem;
            border-radius: 50%;
          }
          .userName {
            padding-left: 0.5rem;
            vertical-align: super;
            color: rgba(0, 0, 0, 0.7);
            &:hover {
              color: $diy_blue;
            }
          }
        }
        &:hover {
          cursor: pointer;
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}
</style>
