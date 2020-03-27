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
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="loginVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
    };
    let validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
    };
    return {
      ruleForm: {
        name: "",
        password: ""
      },
      rules: {
        name: [
          {
            required: true,
            validator: validateName,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            validator: validatePassword,
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    loginVisible: {
      type: Boolean
    }
  },
  methods: {
    /**
     * 点击空白处或者点击取消按钮是 出现确认框
     * 用自定义事件向父组件传递false值，关闭模态框
     */

    handleClose() {
      this.$confirm("关闭后数据将会清空, 是否继续?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.$emit("changeLoginVisible", false);
        })
        .catch(err => console.log(err));
    }
  }
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
