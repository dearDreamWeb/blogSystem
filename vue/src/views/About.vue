<template>
  <div class="about">
    <div class="container">
      <h1 style="color:#f40">This is an about page</h1>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  // data() {
  //   return {
  //     userInfo: {}
  //   }
  // },
  // methods: {
  //   initData() {
  //     // 判断当注销过用户信息后不调用getUserInfo方法
  //     let userInfo = this.$store.getters.getUserInfo;
  //     userInfo.userInfo && this.getUserInfo();
  //   },

  //   // 获取用户数据
  //   getUserInfo() {
  //     let userInfo = this.$store.getters.getUserInfo;
  //     let user_id = userInfo.userInfo.user_id;
  //     let isLogin = userInfo.userInfo.isLogin;
  //     this.isLogin = isLogin;
  //     this.$axios({
  //       method: "get",
  //       url: "/getUserInfo",
  //       params: {
  //         user_id
  //       }
  //     })
  //       .then(res => {
  //         if (res.data.state === 0) {
  //           this.userInfo = res.data.userInfo;
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   }
  // },
  // created() {
  //   this.initData();
  // },
  components: {}
};
</script>

<style scoped lang="scss">
@import "../common/styles";
.about {
  .container {
    margin: 0 auto;
    width: 60%;
    background-color: $div_bgColor;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    padding: 1rem;
  }
}
</style>