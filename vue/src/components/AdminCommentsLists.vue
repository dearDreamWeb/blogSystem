<template>
  <div class="admin_commentsLists">
    admin_commentsLists
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
// import moment from "moment";
export default {
  data() {
    return {
      options: [
        {
          value: 0,
          label: "按评论ID查询",
        },
        {
          value: 1,
          label: "按评论内容查询",
        },
        {
          value: 2,
          label: "按评论者查询",
        },
        {
          value: 3,
          label: "按文章标签查询",
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
        total: 100, // 总数据条数
      },
      dialogTableVisible: false, // 弹出框
      sort_orderBy: 0, //排列顺序 0代表desc；1代表asc
      tableData: [], // 表格文章数据
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../common/styles/index.scss";
.admin_commentsLists {
  padding: 20px;
  background-color: $div_bgColor;
  // 底部分页
  .page_footer {
    margin-top: 20px;
  }
}
</style>
