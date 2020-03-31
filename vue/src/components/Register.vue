<template>
  <div class="register">
    <el-dialog
      title="注册"
      :visible.sync="registerVisible"
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

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="ruleForm.confirmPassword"
          ></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="ruleForm.nickName"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio v-model="ruleForm.sex" label="1">男</el-radio>
          <el-radio v-model="ruleForm.sex" label="0">女</el-radio>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>

        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="ruleForm.birthday"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-cascader
            v-model="ruleForm.address"
            :options="cities"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:3000/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="ruleForm.imageUrl"
              :src="ruleForm.imageUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="验证码" prop="confirmCode">
          <v-canvas @nowVal="nowVal" :isRefresh="isRefresh"></v-canvas>
          <el-input v-model="ruleForm.confirmCode"></el-input>
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
    // 确认密码校验
    let validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (value != this.ruleForm.password) {
        return callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    //  邮箱校验
    let validateEmail = (rule, value, callback) => {
      let reg = /^([\w-]+)(?:\.([\w-]+))*?@([a-zA-Z0-9]+)(?:\.([a-zA-Z]+))+$/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      } else if (!reg.test(value)) {
        return callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };

    //  昵称校验
    let validateNickName = (rule, value, callback) => {
      let regWord = /[`!#$%^&*@,.()+<>?:"{}\\/;'[\]·！#￥（——）：；“”‘、，|《。》？、【】[\]]/i;
      let regNickName = /[a-zA-Z0-9_\u4e00-\u9fa5]{3,9}/;
      if (!value) {
        return callback(new Error("昵称不能为空"));
      } else if (regWord.test(value)) {
        return callback(new Error("昵称不能有特殊符号"));
      } else if (!regNickName.test(value)) {
        return callback(
          new Error(
            "昵称长度必须是3到9个字符，只能包含英文、中文、下划线和数字"
          )
        );
      } else {
        callback();
      }
    };

    //  生日校验
    let validateBirthday = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("生日不能为空"));
      } else {
        callback();
      }
    };
    //  地址校验
    let validateAddress = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error("地址不能为空"));
      } else {
        callback();
      }
    };

    //  头像校验
    let validateAvatar = (rule, value, callback) => {
      if (!this.ruleForm.imageUrl) {
        return callback(new Error("头像不能为空"));
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
        confirmPassword: "",
        nickName: "",
        email: "",
        sex: "1",
        birthday: "",
        address: "",
        imageUrl: "",
        confirmCode: "",
        nowConfirmCode: ""
      },
      cities: [],
      isRefresh: false, // 是否刷新canvas验证码
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
        ],
        confirmPassword: [
          {
            required: true,
            validator: validateConfirmPassword,
            trigger: "blur"
          }
        ],
        nickName: [
          {
            required: true,
            validator: validateNickName,
            trigger: "blur"
          }
        ],
        sex: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            validator: validateEmail,
            trigger: "blur"
          }
        ],
        birthday: [
          {
            required: true,
            validator: validateBirthday,
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            validator: validateAddress,
            trigger: "change"
          }
        ],
        avatar: [
          {
            required: true,
            validator: validateAvatar,
            trigger: "blur"
          }
        ],
        confirmCode: [
          {
            required: true,
            validator: validateConfirmCode,
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    registerVisible: {
      type: Boolean
    }
  },
  methods: {
    /**
     * 点击空白处或者点击取消按钮是 出现确认框
     * 用自定义事件向父组件传递false值和清空form表单的值，关闭模态框
     */

    handleClose() {
      this.$confirm("关闭后数据将会清空, 是否继续?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.$emit("changeRegisterVisible", false);
          // 清空form表单的值
          this.$refs["ruleForm"].resetFields();
          this.ruleForm.imageUrl = "";
        })
        .catch(err => console.log(err));
    },

    // 初始化城市
    init() {
      this.$axios({
        method: "get",
        url: "/getCities"
      })
        .then(res => {
          if (res.data.state === 0) {
            this.cities = JSON.parse(res.data.cityData[0].cities);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**
     *提交
     *成功的话，清空表单并自定义事件关闭模态框
     *失败的话，提示错误
     */
    submitForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$axios({
              method: "get",
              url: "/register",
              params: {
                ruleForm: this.ruleForm
              }
            })
              .then(res => {
                if (res.data.state === 0) {
                  this.$message.success("注册成功");
                  this.$refs["ruleForm"].resetFields();
                  this.ruleForm.imageUrl = "";
                  this.$emit("changeRegisterVisible", false);
                } else if (res.data.state === 1) {
                  this.$message.success("用户名已存在，注册失败");
                }
              })
              .catch(() => {
                this.$message.error("注册失败");
              });
          } else {
            this.$message.error("请输入正确信息");
          }
        });
      });
    },

    /**
     * 上传头像
     */
    // 上传成功    显示图片
    handleAvatarSuccess(res) {
      if (res.state === 0) {
        this.ruleForm.imageUrl = res.imgUrl;
      }
    },
    // 上传之前的校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 验证码正确的值
    nowVal(val) {
      this.ruleForm.nowConfirmCode = val;
    }
  },
  watch: {
    // 监听registerVisible，当为true时，显示模态框时，改变isRefresh，让canvas组件刷新验证码
    registerVisible(val) {
      this.isRefresh = val;
    }
  },
  mounted() {
    this.init();
  },
  components: {
    vCanvas: Canvas
  }
};
</script>

<style scoped lang="scss">
.register {
  .dialog {
    margin: 0 auto;
    .demo-ruleForm {
      padding: 0 5rem;
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
        border: 1px dashed #d9d9d9;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
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
