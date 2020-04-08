<template>
  <div class="editData">
    <div class="divider">
      <!-- elementui内置的分割线标签 -->
      <el-divider>
        <h1 class="title">个人资料</h1>
      </el-divider>
    </div>
    <!-- form表单 -->
    <el-form
      :model="data"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
      label-position="left"
    >
      <el-form-item label="用户名">
        <el-input v-model="data.user_name" disabled></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="user_password">
        <el-input type="password" v-model="data.user_password"></el-input>
      </el-form-item>

      <el-form-item label="昵称" prop="user_nickName">
        <el-input v-model="data.user_nickName"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="user_sex">
        <el-radio v-model="data.user_sex" label="1">男</el-radio>
        <el-radio v-model="data.user_sex" label="0">女</el-radio>
      </el-form-item>

      <el-form-item label="邮箱" prop="user_email">
        <el-input v-model="data.user_email"></el-input>
      </el-form-item>

      <el-form-item label="出生日期" prop="user_birthday">
        <el-date-picker
          v-model="data.user_birthday"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="地址" prop="user_address">
        <el-cascader
          v-model="data.user_address"
          :options="cities"
          :placeholder="data.user_address"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="头像" prop="user_avatar">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:3000/api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="data.user_avatar" :src="data.user_avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="quitEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
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
      if (!this.data.user_avatar) {
        return callback(new Error("头像不能为空"));
      } else {
        callback();
      }
    };

    return {
      cities: [],
      rules: {
        user_password: [
          {
            required: true,
            validator: validatePassword,
            trigger: "blur",
          },
        ],
        user_nickName: [
          {
            required: true,
            validator: validateNickName,
            trigger: "blur",
          },
        ],
        user_sex: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        user_email: [
          {
            required: true,
            validator: validateEmail,
            trigger: "blur",
          },
        ],
        user_birthday: [
          {
            required: true,
            validator: validateBirthday,
            trigger: "blur",
          },
        ],
        user_address: [
          {
            required: true,
            validator: validateAddress,
            trigger: "change",
          },
        ],
        user_avatar: [
          {
            required: true,
            validator: validateAvatar,
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
  },
  methods: {
    /**
     * 初始化数据
     */
    initData() {
      setTimeout(() => {
        this.data.user_sex = this.data.user_sex.toString();
      }, 300);
      this.initCities();
    },

    /**
     * 初始化城市
     */
    initCities() {
      this.$axios({
        method: "get",
        url: "/getCities",
      })
        .then((res) => {
          if (res.data.state === 0) {
            this.cities = JSON.parse(res.data.cityData[0].cities);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     * 上传头像
     */
    // 上传成功    显示图片
    handleAvatarSuccess(res) {
      if (res.state === 0) {
        this.data.user_avatar = res.imgUrl;
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

    /**
     * 点击提交按钮修改数据
     */
    submitForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios({
              method: "post",
              url: "/updateUserData",
              data: {
                data: this.data,
              },
            })
              .then((res) => {
                if (res.data.state === 0) {
                  this.$message.success("修改成功");
                  // 自定义事件关闭界面
                  this.$emit("colseEdit");
                }
              })
              .catch(() => {
                this.$message.error("修改失败");
              });
          } else {
            this.$message.error("请输入正确信息");
          }
        });
      });
    },
    /**
     * 点击取消按钮退出编辑
     */
    quitEdit() {
      this.$confirm("关闭后数据将会清空, 是否继续?", "提示", {
        type: "warning",
      })
        .then(() => {
          // 自定义事件关闭界面
          this.$emit("colseEdit");
          // 清空form表单的值
          this.$refs["ruleForm"].resetFields();
          this.data.user_avatar = "";
        })
        .catch((err) => console.log(err));
    },
  },
  watch: {
    data: {
      // 深度监听user_address，因为地址会以数组的形式出现的，所以把数组转换成字符串
      handler(val) {
        if (typeof val.user_address == "object") {
          let str = "";
          val.user_address.forEach((item) => {
            str += item;
          });
          val.user_address = str;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped lang="scss">
.editData {
  .divider {
    padding-bottom: 1rem;
    .title {
      font-size: 1.2rem;
    }
  }
  .demo-ruleForm {
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
}
</style>
