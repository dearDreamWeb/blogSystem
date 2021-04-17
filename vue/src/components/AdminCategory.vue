<template>
  <div class="admin_category">
    <header class="header_search">
      <div class="select_container">
        <el-input
          placeholder="请输入关键字"
          v-model="keyWord"
          class="input-with-select"
          clearable
        >
          <el-select
            v-model="selectedValue"
            slot="prepend"
            placeholder="请选择"
            class="select_wrap"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchData"
          ></el-button>
        </el-input>
      </div>
    </header>
    <main>
      <div class="category_table">
        <el-table
          :data="tableData"
          stripe
          border
          lazy
          @sort-change="changeSort"
          :header-cell-style="{ backgroundColor: '#157dcf', color: '#fff' }"
          style="width: 100%"
        >
          <!-- 博客分类ID -->
          <el-table-column prop="cate_id" label="博客分类ID" min-width="10%">
          </el-table-column>
          <!-- 博客分类名称 -->
          <el-table-column
            prop="cate_name"
            label="博客分类名称"
            min-width="15%"
          >
          </el-table-column>
          <!-- 是否为默认分类 -->
          <el-table-column
            prop="is_default"
            label="是否为默认分类"
            min-width="10%"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.is_default === 1 ? 'success' : 'info'"
                size="medium"
                >{{ scope.row.is_default === 1 ? "是" : "否" }}</el-tag
              >
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            prop="created_time"
            sortable="custom"
            label="创建时间"
            min-width="15%"
          >
            <template slot-scope="scope">
              {{ scope.row.created_time | formaterrDate }}
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" min-width="20%">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.is_default === 0"
                type="primary"
                size="mini"
                @click="setDefault(scope.row, 'set')"
                >设为默认分类</el-button
              >
              <el-button
                v-else
                type="success"
                size="mini"
                @click="setDefault(scope.row, 'cancel')"
                >取消默认分类</el-button
              >

              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click.native="deletCate(scope.row, scope.$index)"
                >移除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
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
  data() {
    return {
      options: [
        {
          value: 0,
          label: "按博客分类ID查询",
        },
        {
          value: 1,
          label: "按博客分类的内容",
        },
      ],
      selectedValue: 0,
      keyWord: "",
      postConetentLen: 15, // 文章内容截取的长度
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
        url: "/admin/category/queryAll",
        params: {
          selectedValue: this.selectedValue,
          keyWord: this.keyWord,
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          sort_orderBy: this.sort_orderBy,
        },
      })
        .then(res => {
          if (res.data.status === 0) {
            this.pageData.total = res.data.total;
            this.tableData = res.data.allCate;
          }
        })
        .catch(err => console.log(err));
    },
    /**
     * 设为或者取消默认
     */
    setDefault(data, type) {
      const { cate_id, is_default } = data;
      this.$axios({
        method: "put",
        url: "/admin/category/changeIsDefault",
        params: {
          cate_id,
          is_default,
        },
      })
        .then(res => {
          if (res.data.status === 0) {
            this.$message.success(
              `${type === "set" ? "设为默认分类成功" : "取消默认分类成功"}`
            );
            this.ininTableData();
          }
        })
        .catch(err => console.log(err));
    },
    /**
     * 搜索
     */
    searchData() {
      this.ininTableData();
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
     * 删除分类
     */
    deletCate(data, index) {
      const { cate_id } = data;
      this.$axios({
        method: "delete",
        url: "/admin/category/deleteCate",
        params: {
          cate_id,
        },
      })
        .then(res => {
          if (res.data.status === 0) {
            this.$message.success(res.data.msg);
            this.ininTableData();
          }
        })
        .catch(err => console.log(err));
    },
  },
  mounted() {
    this.ininTableData();
  },
  filters: {
    // 格式化文章发布时间
    formaterrDate(val) {
      return moment(new Date(val)).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../common/styles/index.scss";
.admin_category {
  padding: 20px;
  background-color: $div_bgColor;
  // 头部搜索
  .select_container {
    padding-bottom: 20px;
    width: 50%;
    .select_wrap {
      width: 160px;
    }
  }
  .main {
    .post_title {
      font-size: 30px;
      padding-bottom: 20px;
    }
    .post_content {
      line-height: 2;
      overflow-x: hidden;
    }
  }
}
</style>
