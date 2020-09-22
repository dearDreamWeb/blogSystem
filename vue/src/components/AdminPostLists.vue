<template>
  <div class="admin_postLists">
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
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </header>
    <main class="main">
      <el-table
        :data="tableData"
        stripe
        border
        lazy
        :header-cell-style="{ backgroundColor: '#157dcf', color: '#fff' }"
        style="width: 100%"
      >
        <!-- 文章ID -->
        <el-table-column prop="post_id" label="文章ID" width="180">
        </el-table-column>
        <!-- 作者 -->
        <el-table-column prop="user_nickName" label="作者" width="180">
        </el-table-column>
        <!-- 文章标签 -->
        <el-table-column prop="post_tag" label="文章标签" width="180">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.post_tag }}</el-tag>
          </template>
        </el-table-column>
        <!-- 发布时间 -->
        <el-table-column prop="user_createdTime" label="发布时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.user_createdTime | formaterrDate }}
          </template>
        </el-table-column>
        <!-- 文章标题 -->
        <el-table-column prop="post_title" label="文章标题" width="250">
        </el-table-column>
        <!-- 文章内容 -->
        <el-table-column
          prop="post_title"
          label="文章内容"
          width="250"
          :formatter="formatterContent"
        >
        </el-table-column>
        <!-- 操作 -->
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-more"
              size="mini"
              @click="moreInfo(scope.row)"
              >详情</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 详情弹出窗 -->
      <el-dialog title="文章详情" :visible.sync="dialogTableVisible">
        <h2 class="post_title" ref="post_title"></h2>
        <section class="post_content" ref="post_content"></section>
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
        :page-sizes="[10, 30, 50, 100]"
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
          label: "按文章ID查询",
        },
        {
          value: 1,
          label: "按文章标题或内容查询",
        },
        {
          value: 2,
          label: "按作者查询",
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
      tableData: [],
    };
  },
  methods: {
    /**
     * 初始化tableData数据
     */
    ininTableData() {
      this.$axios({
        method: "get",
        url: "/admin/postLists",
        params: {
          selectedValue: this.selectedValue,
          keyWord: this.keyWord,
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          orderBy: 0,
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
     * 按照时间排序
     */
    sortChange(row, column) {
      console.log(row, column);
    },

    /**
     * 整理文章内容
     */
    formatterContent(data) {
      return (
        data.post_content
          .replace(/<[^>]+>|&[^>]+;/g, "")
          .slice(0, this.postConetentLen) + "..."
      );
    },

    /**
     * 详情
     */
    moreInfo(data) {
      this.dialogTableVisible = true;
      this.morePostInfo = data;
      this.$nextTick(() => {
        let postTitle = this.$refs.post_title;
        let postContent = this.$refs.post_content;
        postTitle.innerHTML = data.post_title;
        postContent.innerHTML = data.post_content;
      });
    },
  },
  filters: {
    // 格式化文章发布时间
    formaterrDate(val) {
      return moment(new Date(val)).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  mounted() {
    this.ininTableData();
  },
};
</script>

<style lang="scss" scoped>
@import "../common/styles/index.scss";
.admin_postLists {
  padding: 20px;
  background-color: $div_bgColor;
  // 头部搜索
  .select_container {
    padding-bottom: 20px;
    width: 50%;
    .select_wrap {
      width: 150px;
    }
  }
  // 主体部分
  .main {
    .post_title {
      font-size: 30px;
      padding-bottom: 20px;
    }
    .post_content {
      height: 50vh;
      line-height: 2;
      overflow-x: hidden;
    }
  }
  // 底部分页
  .page_footer {
    margin-top: 20px;
  }
}
</style>
