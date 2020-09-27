<template>
  <div class="admin_login">
    <div class="container_login">
      <div class="left">
        <img src="../assets/images/admin_login.png" alt="管理员图标" />
      </div>
      <div class="right">
        <h1 class="title">管理员登录</h1>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <!-- 管理员账号 -->
          <el-form-item prop="username">
            <el-input
              type="text"
              prefix-icon="el-icon-s-custom"
              v-model="ruleForm.username"
              autocomplete="off"
              placeholder="请输入管理员账号"
              autofocus="true"
            ></el-input>
          </el-form-item>
          <!-- 管理员密码 -->
          <el-form-item prop="pass">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              autocomplete="off"
              prefix-icon="el-icon-lock"
              placeholder="请输入管理员密码"
              @keydown.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-form-item>
          <!-- 提交按钮 -->
          <el-form-item label-width="0">
            <el-button
              class="submit_btn"
              type="success"
              @click="submitForm('ruleForm')"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 校验用户名
    var validateUsername = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    // 校验密码
    var validatePass = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        pass: "",
        username: "",
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            method: "post",
            url: "/admin_login",
            data: {
              username: this.ruleForm.username,
              password: this.ruleForm.pass,
            },
          })
            .then(res => {
              if (res.data.status === 0) {
                this.$store.commit("setAdminUsername", res.data.adminUsername);
                this.$message.success(res.data.message);
                this.$router.push("/admin");
              } else {
                this.$message.warning(res.data.message);
              }
            })
            .catch(err => console.log(err));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let adminUsername = vm.$store.getters.getAdminUsername;
      if (adminUsername) {
        vm.$message.info("管理员已登录");
        vm.$router.push("/admin");
        return false;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../common/styles/index.scss";
.admin_login {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(-20deg, #d558c8 0%, #24d292 100%);
  overflow: hidden;
  //   主要部分
  .container_login {
    display: flex;
    justify-content: space-between;
    margin: 80px auto;
    padding: 100px 70px;
    width: 50%;
    background: $div_bgColor;
    border-radius: 10px;
    .left,
    .right {
      width: 100%;
    }
    // 右边区域
    .right {
      .title {
        text-align: center;
        font-size: 24px;
        padding-bottom: 30px;
      }
      .submit_btn {
        width: 100%;
      }
    }
  }
  @media screen and (max-width: 992px) {
    .container_login {
      margin: 0;
      padding: 0;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      height: 100%;
      border-radius: 0;
      background-image: linear-gradient(-20deg, #d558c8 0%, #24d292 100%);
      .left {
        text-align: center;
        padding-bottom: 20px;
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 80%;
        .demo-ruleForm {
          .el-form-item__content {
            padding-left: 0 !important;
          }
        }
      }
    }
  }
}
</style>
