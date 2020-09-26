<template>
  <div class="login">
    <el-dialog
      title="登录"
      :visible.sync="loginVisible"
      :before-close="handleClose"
      class="dialog"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="confirmCode">
          <v-canvas @nowVal="nowVal" :isRefresh="isRefresh"></v-canvas>
          <el-input
            v-model="ruleForm.confirmCode"
            @keydown.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Canvas from "./Canvas";
export default {
  data() {
    //  用户名校验
    let validateName = (rule, value, callback) => {
      let regWord = /[`!#$%^&*@,.()_+<>?:"{}\\/;'[\]·！#￥（——）：；“”‘、，|《。》？、【】[\] \u4e00-\u9fa5]/i;
      let regName = /\w{3,9}/;
      if (!value) {
        return callback(new Error("用户名不能为空"));
      } else if (regWord.test(value)) {
        return callback(new Error("用户名不能有特殊符号或者中文"));
      } else if (!regName.test(value)) {
        return callback(
          new Error("用户名长度必须是3到9个字符，只能包含英文和数字")
        );
      } else {
        callback();
      }
    };

    // 密码校验
    let validatePassword = (rule, value, callback) => {
      let regWord = /[`!#$%^&*()_+<>?:"{}\\/;'[\]·！#￥（——）：；“”‘、，|《。》？、【】[\] \u4e00-\u9fa5]/i;
      let regPassword = /[\w,.@]{3,16}/;
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (regWord.test(value)) {
        return callback(new Error("密码不能有特殊符号或者中文"));
      } else if (!regPassword.test(value)) {
        return callback(
          new Error(
            "密码长度必须是3到16个字符，只能包含英文、数字和特殊字符@,."
          )
        );
      } else {
        callback();
      }
    };

    // 验证码校验
    let validateConfirmCode = (rule, value, callback) => {
      if (
        value.toString().toLowerCase() ===
        this.ruleForm.nowConfirmCode.toString().toLowerCase()
      ) {
        callback();
      } else {
        return callback(new Error("验证码错误"));
      }
    };
    return {
      ruleForm: {
        name: "",
        password: "",
        confirmCode: "",
        nowConfirmCode: "",
      },
      isRefresh: false,
      rules: {
        name: [
          {
            required: true,
            validator: validateName,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            validator: validatePassword,
            trigger: "blur",
          },
        ],
        confirmCode: [
          {
            required: true,
            validator: validateConfirmCode,
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    loginVisible: {
      type: Boolean,
    },
  },
  methods: {
    /**
     * 点击空白处或者点击取消按钮是 出现确认框
     * 用自定义事件向父组件传递false值，关闭模态框
     */

    handleClose() {
      this.$confirm("关闭后数据将会清空, 是否继续?", "提示", {
        type: "warning",
      })
        .then(() => {
          this.$emit("changeLoginVisible", false);
          // 清空form表单的值
          this.$refs["ruleForm"].resetFields();
        })
        .catch(err => console.log(err));
    },

    /**
     *提交
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            method: "get",
            url: "/login",
            params: {
              userName: this.ruleForm.name,
              userPassword: this.ruleForm.password,
            },
          })
            .then(res => {
              switch (res.data.status) {
                case 0:
                  this.$message.success("登录成功");
                  this.$refs["ruleForm"].resetFields();
                  // 向vuex中传入登录成功的用户的id
                  this.$store.commit("setUserInfo", res.data.user_id);
                  this.$emit("userIsLogin");
                  this.$emit("changeLoginVisible", false);
                  this.$router.push({ name: "homeLink" }).catch(() => {
                    window.location.reload();
                  });
                  break;
                case 1:
                  this.$message.error("用户名或密码错误");
                  break;
                case 2:
                  this.$alert(
                    "该账号已被冻结，请添加微信客服：web2020_",
                    "提示",
                    {
                      confirmButtonText: "确定",
                      type: "warning",
                    }
                  );
                  break;
                default:
                  break;
              }
              // if (res.data.status === 0) {
              //   this.$message.success("登录成功");
              //   this.$refs["ruleForm"].resetFields();
              //   // 向vuex中传入登录成功的用户的id
              //   this.$store.commit("setUserInfo", res.data.user_id);
              //   this.$emit("userIsLogin");
              //   this.$emit("changeLoginVisible", false);
              //   this.$router.push({ name: "homeLink" }).catch(() => {
              //     window.location.reload();
              //   });
              // } else if (res.data.status === 1) {
              //   this.$message.error("用户名或密码错误");
              // }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message.error("请输入正确信息");
        }
      });
    },

    // 验证码正确的值
    nowVal(val) {
      this.ruleForm.nowConfirmCode = val;
    },
  },
  watch: {
    // 监听loginVisible，当为true时，显示模态框时，改变isRefresh，让canvas组件刷新验证码
    loginVisible(val) {
      this.isRefresh = val;
    },
  },
  components: {
    vCanvas: Canvas,
  },
};
</script>

<style scoped lang="scss">
.login {
  .dialog {
    margin: 0 auto;
    .demo-ruleForm {
      padding: 0 5rem;
    }
    @media screen and (max-width: 768px) {
      width: 200%;
      .demo-ruleForm {
        padding: 0;
      }
    }
  }
}
</style>
