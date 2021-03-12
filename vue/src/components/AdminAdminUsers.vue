<template>
  <div class="admin_usersLists">
    <header class="header_search">
      <div class="select_container">
        <!-- 日期选择器 -->
        <el-date-picker
          v-model="dateVal"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          class="datePicker_wrap"
        >
        </el-date-picker>
        <!-- 输入关键字 -->
        <el-input
          placeholder="请输入用户ID或用户名"
          v-model="keyWord"
          class="input-with-select"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchData"
          ></el-button>
        </el-input>
      </div>
    </header>
    <!-- 主体部分 -->
    <main class="main">
      <el-button
        type="success"
        icon="el-icon-plus"
        @click="
          isSuperAdmin
            ? addAdminUser()
            : $message.warning('该操作仅支持超级管理员')
        "
        >添加管理员</el-button
      >

      <!-- 用户表格 -->
      <div class="usersTable">
        <el-table
          :data="tableData"
          stripe
          border
          lazy
          @sort-change="changeSort"
          :header-cell-style="{ backgroundColor: '#157dcf', color: '#fff' }"
          style="width: 100%"
        >
          <!-- 用户ID -->
          <el-table-column fixed="left" prop="id" label="ID"> </el-table-column>
          <!-- 用户名 -->
          <el-table-column prop="username" label="用户名"> </el-table-column>
          <!-- 加入时间 -->
          <el-table-column
            prop="created_time"
            sortable="custom"
            label="加入时间"
          >
            <template slot-scope="scope">
              {{ scope.row.created_time | formaterrDate }}
            </template>
          </el-table-column>
          <!-- 角色 -->
          <el-table-column prop="category" label="角色">
            <template slot-scope="scope">
              {{ scope.row.category === 1 ? "超级管理员" : "普通管理员" }}
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改密码 -->
              <i
                class="el-icon-unlock icon"
                title="修改密码"
                @click="
                  isSuperAdmin
                    ? changeUserPass(scope.row)
                    : $message.warning('该操作仅支持超级管理员')
                "
              ></i>
              <!-- 删除 -->
              <i
                class="el-icon-delete icon"
                title="删除"
                @click="
                  isSuperAdmin
                    ? deleteUser(scope.row, scope.$index)
                    : $message.warning('该操作仅支持超级管理员')
                "
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 修改密码弹出窗 -->
      <el-dialog
        :title="editUserData.id ? '修改密码' : '添加管理员'"
        :visible.sync="dialogTableVisible"
        class="dialog"
        :before-close="handleClose"
      >
        <!-- 修改密码的form 表单 -->
        <div v-if="editUserData.id" class="form_wrap">
          <p class="userInfo">用户ID：{{ editUserData.id }}</p>
          <p class="userInfo">用户名：{{ editUserData.username }}</p>
          <el-form
            label-position="top"
            label-width="80px"
            :model="editUserData"
            status-icon
            :rules="rules"
            ref="ruleForm"
          >
            <el-form-item label="新密码" prop="newPass">
              <el-input
                type="password"
                v-model="editUserData.newPass"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkNewPass">
              <el-input
                type="password"
                v-model="editUserData.checkNewPass"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 添加新用户的form 表单 -->
        <div v-else>
          <el-form
            label-position="top"
            label-width="80px"
            :model="newUserFormData"
            status-icon
            :rules="rules"
            ref="ruleForm"
          >
            <el-form-item
              label="用户名"
              prop="adminUserName"
              :error="errors.usernameError"
            >
              <el-input
                type="text"
                v-model="newUserFormData.adminUserName"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="newUserFormData.password"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                type="password"
                v-model="newUserFormData.checkPass"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <footer slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditUserInfo('ruleForm')"
            >确 定</el-button
          >
        </footer>
      </el-dialog>
    </main>
    <!-- 底部分页 -->
    <footer class="page_footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageSize"
        :page-sizes="pageData.pageSizeArr"
        @current-change="changeCurrentPage"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </footer>
  </div>
</template>

<script>
import moment from "moment";
export default {
  inject: ["reload"], //刷新页面
  props: {
    isSuperAdmin: {
      type: Boolean,
      required: true,
    },
  },
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
    // 校验新密码
    var validateNewPass = (rule, value, callback) => {
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
    // 校验确认密码
    var validateCheckNewPass = (rule, value, callback) => {
      let password = this.editUserData.newPass
        ? this.editUserData.newPass
        : this.newUserFormData.password;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      dateVal: "", // 日期范围
      keyWord: "",
      newUserFormData: {}, // 添加新用户的form表单数据
      editUserData: {}, // 要修改的用户信息
      // 分页中的数据
      pageData: {
        currentPage: 1, // 当前页
        pageSize: 10, // 当前每页多少条数据
        pageSizeArr: [10, 30, 50, 100], // 每天条数的选择
        total: 0, // 总数据条数
      },
      dialogTableVisible: false, // 弹出框
      sort_orderBy: 0, //排列顺序 0代表desc；1代表asc
      tableData: [], // 表格文章数据
      // 日期最近的范围
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      // form表单规则
      rules: {
        newPass: [{ validator: validateNewPass, trigger: "blur" }],
        checkNewPass: [{ validator: validateCheckNewPass, trigger: "blur" }],
        adminUserName: [{ validator: validateName, trigger: "blur" }],
        password: [{ validator: validateNewPass, trigger: "blur" }],
        checkPass: [{ validator: validateCheckNewPass, trigger: "blur" }],
      },
      // form表单错误
      errors: {
        usernameError: "", // 用户名错误提示
      },
    };
  },
  methods: {
    /**
     * 初始化tableData数据
     */
    ininTableData() {
      this.tableData = [];
      this.$axios({
        method: "get",
        url: "/admin/adminUsersLists",
        params: {
          dateVal: this.dateVal ? this.dateVal : "",
          keyWord: this.keyWord,
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          sort_orderBy: this.sort_orderBy,
        },
      })
        .then(res => {
          if (res.data.status === 0) {
            this.pageData.total = res.data.total;
            this.tableData = res.data.allPost;
          }
        })
        .catch(err => console.log(err));
    },

    /**
     * 页码发生改变时
     */
    changeCurrentPage(val) {
      this.pageData.currentPage = val;
      this.ininTableData();
    },
    /**
     * 每页多少条数据发生变化时
     */
    handleSizeChange(val) {
      this.pageData.pageSize = val;
      this.ininTableData();
    },

    /**
     * 搜索
     */
    searchData() {
      this.ininTableData();
    },
    /**
     * 时间排序
     */
    changeSort(data) {
      if (data.order === "ascending") {
        this.sort_orderBy = 1;
      } else {
        this.sort_orderBy = 0;
      }
      this.ininTableData();
    },

    /**
     * 点击编辑用户信息按钮
     */
    changeUserPass(data) {
      this.editUserData = data;
      this.dialogTableVisible = true;
    },

    /**
     * 提交编辑用户的信息
     */
    submitEditUserInfo(formName) {
      this.errors.usernameError = "";
      this.$refs[formName].validate(valid => {
        if (valid) {
          // url
          let url = this.editUserData.id
            ? "/admin/changeAdminUserPass"
            : "/admin/addAdminUser";
          // 参数data
          let data = this.editUserData.id
            ? {
                adminUser_id: this.editUserData.id,
                newPass: this.editUserData.newPass,
              }
            : {
                username: this.newUserFormData.adminUserName,
                password: this.newUserFormData.password,
              };
          this.$axios({
            method: "post",
            url,
            data,
          })
            .then(res => {
              // res.data.status 为0时代表修改密码成功
              if (res.data.status === 0) {
                this.dialogTableVisible = false;
                this.$refs[formName].resetFields();
                this.$message.success(res.data.mess);
                if (!this.editUserData.id) {
                  this.reload();
                }
              }
            })
            .catch(err => console.log(err));
        } else {
          this.$message.error("请输入正确信息");
        }
      });
    },

    /**
     * 删除用户
     */
    deleteUser(data, index) {
      this.$confirm("此操作将永久删除该用户的所有记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "delete",
            url: "/admin/deleteAdminUser",
            params: {
              adminUser_id: data.id,
            },
          })
            .then(res => {
              if (res.data.status === 0) {
                this.$message.success(res.data.mess);
                this.tableData.splice(index, 1);
                this.pageData.total--;
              }
            })
            .catch(err => console.log(err));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    /**
     * 确认是否关闭对话框
     */
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },

    /**
     * 添加管理员按钮
     */
    addAdminUser() {
      this.dialogTableVisible = true;
    },
  },
  filters: {
    // 格式化文章发布时间
    formaterrDate(val) {
      return moment(new Date(val)).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  watch: {
    // 当对话框隐藏时，清空表单数据
    dialogTableVisible(newVal) {
      if (newVal === false) {
        this.$refs["ruleForm"].resetFields();
        this.editUserData = {};
        this.newUserFormData = {};
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.ininTableData();
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../common/styles/index.scss";
.admin_usersLists {
  padding: 20px;
  background-color: $div_bgColor;
  // 头部搜索
  .select_container {
    display: flex;
    padding-bottom: 20px;
    .datePicker_wrap {
      margin-right: 10px;
      width: 400px;
    }
    .input-with-select {
      width: 300px;
    }
  }
  // 主体部分
  .main {
    .usersTable {
      margin-top: 20px;
    }
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .icon {
      margin-right: 20px;
      font-size: 20px;
      color: $black;
      &:hover {
        cursor: pointer;
      }
      &:nth-child(1) {
        &:hover {
          color: $blue;
        }
      }
      &:nth-child(2) {
        &:hover {
          color: $green;
        }
      }
      &:nth-child(3) {
        &:hover {
          color: $jd_color;
        }
      }
    }
  }
  // 底部分页
  .page_footer {
    margin-top: 20px;
  }
  // 对话框
  .dialog {
    .form_wrap {
      .userInfo {
        padding-bottom: 10px;
      }
    }
  }
}
</style>
