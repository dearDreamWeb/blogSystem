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
          placeholder="请输入用户ID或昵称"
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
      <el-radio-group v-model="radio">
        <el-radio :label="2">全部用户</el-radio>
        <el-radio :label="0">正常用户</el-radio>
        <el-radio :label="1">冻结用户</el-radio>
      </el-radio-group>
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
          <el-table-column
            fixed="left"
            prop="user_id"
            label="用户ID"
            min-width="150"
          >
          </el-table-column>
          <!-- 用户名 -->
          <el-table-column prop="user_name" label="用户名" min-width="120">
          </el-table-column>
          <!-- 昵称 -->
          <el-table-column prop="user_nickName" label="昵称" min-width="180">
          </el-table-column>
          <!-- 加入时间 -->
          <el-table-column
            prop="user_createdTime"
            sortable="custom"
            label="加入时间"
            min-width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.user_createdTime | formaterrDate }}
            </template>
          </el-table-column>
          <!-- 性别 -->
          <el-table-column prop="user_sex" label="性别" min-width="50">
            <template slot-scope="scope">
              <i
                :class="
                  scope.row.user_sex === 0 ? 'el-icon-female' : 'el-icon-male'
                "
                :title="scope.row.user_sex === 0 ? '女' : '男'"
              ></i>
            </template>
          </el-table-column>
          <!-- 邮箱 -->
          <el-table-column prop="user_email" label="邮箱" min-width="180">
          </el-table-column>
          <!-- 头像 -->
          <el-table-column prop="user_avatar" label="头像" min-width="80">
            <template slot-scope="scope">
              <img :src="scope.row.user_avatar" alt="头像" class="avatar" />
            </template>
          </el-table-column>
          <!-- 地址 -->
          <el-table-column prop="user_address" label="地址" min-width="180">
          </el-table-column>
          <!-- 生日 -->
          <el-table-column prop="user_birthday" label="生日" min-width="100">
          </el-table-column>

          <!-- 状态 -->
          <el-table-column
            prop="user_isFreeze"
            fixed="right"
            label="状态"
            min-width="80"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.user_isFreeze === 0 ? 'success' : 'danger'"
              >
                {{ scope.row.user_isFreeze === 0 ? "正常" : "冻结" }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column fixed="right" label="操作" min-width="150">
            <template slot-scope="scope">
              <!-- 切换用户状态 -->
              <i
                :class="
                  scope.row.user_isFreeze === 0
                    ? 'el-icon-video-pause icon'
                    : 'el-icon-video-play icon'
                "
                :title="scope.row.user_isFreeze === 0 ? '正常' : '冻结'"
                @click="changeStatus(scope.row, scope.$index)"
              ></i>
              <!-- 修改密码 -->
              <i
                class="el-icon-unlock icon"
                title="修改密码"
                @click="changeUserPass(scope.row)"
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
      <!-- 详情弹出窗 -->
      <el-dialog
        title="修改密码"
        :visible.sync="dialogTableVisible"
        class="dialog"
        :before-close="handleClose"
      >
        <!-- form 表单 -->
        <div v-if="editUserData.user_id" class="form_wrap">
          <p class="userInfo">用户ID：{{ editUserData.user_id }}</p>
          <p class="userInfo">用户名：{{ editUserData.user_name }}</p>
          <p class="userInfo">昵称：{{ editUserData.user_nickName }}</p>
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
  props: {
    isSuperAdmin: {
      type: Boolean,
      required: true,
    },
  },
  data() {
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
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.editUserData.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      dateVal: "", // 日期范围
      keyWord: "",
      radio: 2, // 单选框的值
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
        url: "/admin/usersLists",
        params: {
          status: this.radio,
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
     * 改变用户的状态
     */
    changeStatus(data, index) {
      // 通过user_isFreeze来决定要显示什么信息
      let confirmMess =
        data.user_isFreeze === 0 ? "冻结该用户" : "解除冻结，恢复正常";
      let newStatus = data.user_isFreeze === 0 ? 1 : 0; // 要变成的状态
      // 确认框
      this.$confirm(`是否${confirmMess}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "get",
            url: "/admin/changeIsFreeze",
            params: {
              user_id: data.user_id,
              newStatus,
            },
          })
            .then(res => {
              if (res.data.status === 0) {
                this.tableData[index].user_isFreeze = newStatus;
                this.$message.success("修改成功");
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            method: "post",
            url: "/admin/editUserPass",
            data: {
              user_id: this.editUserData.user_id,
              newPass: this.editUserData.newPass,
            },
          })
            .then(res => {
              // res.data.status 为0时代表修改密码成功
              if (res.data.status === 0) {
                this.dialogTableVisible = false;
                this.$refs[formName].resetFields();
                this.$message.success("修改密码成功");
              } else {
                this.$message.success(res.data.mess);
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
            url: "/admin/deleteUser",
            params: {
              user_id: data.user_id,
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
  },
  filters: {
    // 格式化文章发布时间
    formaterrDate(val) {
      return moment(new Date(val)).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  watch: {
    radio() {
      this.ininTableData();
    },
    // 当对话框隐藏时，清空表单数据
    dialogTableVisible(newVal) {
      if (newVal === false) {
        this.$refs["ruleForm"].resetFields();
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
