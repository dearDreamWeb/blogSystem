<template>
  <div class="home">
    <!-- 排序规则 -->
    <div class="sort">
      <el-select
        class="select-wrapper"
        v-model="sortValue"
        placeholder="排序规则"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="sort_orderBy">
        <el-radio v-model="radioValue" label="1">升序</el-radio>
        <el-radio v-model="radioValue" label="2">降序</el-radio>
      </div>
    </div>
    <!-- 内容区 -->
    <div class="container">
      <!-- 文章遍历 -->
      <ul class="post-wrapper" v-if="allPost.length > 0">
        <li class="post-item" v-for="(item, index) in allPost" :key="index">
          <!-- 点击跳转到文章内容post界面 -->
          <h1
            class="title"
            @click="
              $router.push({
                name: 'postLink',
                params: { post_id: item.post_id },
              })
            "
          >
            {{ item.post_title }}
          </h1>
          <h2 class="post_content" ref="post_content"></h2>
          <!-- 文章列表尾部 -->
          <div class="post_footer">
            <div class="footer_left">
              <!-- 点击作者头像或者名字跳转作者的个人中心 -->
              <div
                @click="
                  $router.push({
                    name: 'aboutLink',
                    params: { id: item.user_id },
                  })
                "
              >
                <img class="avatar" :src="item.user_avatar" alt="头像" />
                <span class="userName">{{ item.user_nickName }}</span>
              </div>
              <!-- 点击搜索标签 -->
              <span class="postTag" @click="searchPostTag(item.post_tag)">{{
                item.post_tag
              }}</span>
            </div>
            <!-- 点赞和阅读 -->
            <div class="tools">
              <span
                class="iconfont icon-zhichi"
                @click="toggleClass(item.post_id, item)"
                :class="{ support: supportArr.includes(item.post_id) }"
                >{{ item.post_praise_count }}</span
              >
              <!-- 点击跳转到文章内容post界面 -->
              <span
                class="iconfont icon-yuedu"
                @click="
                  $router.push({
                    name: 'postLink',
                    params: { post_id: item.post_id },
                  })
                "
                >{{ item.post_read_count }}</span
              >
            </div>
          </div>
        </li>
      </ul>
      <div class="noPost" v-else>暂无数据</div>
      <!-- 底部分页 -->
      <div class="page_footer">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="changeCurrentPage"
          :hide-on-single-page="total / pageSize <= 1"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 回到顶部 -->
    <back-top></back-top>
  </div>
</template>

<script>
// @ is an alias to /src
import BackTop from "@/components/BackTop";

export default {
  data() {
    return {
      allPost: [],
      total: 0, // 数据总条数
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页数据条数
      contentSlice: 80,
      supportArr: [],
      sortValue: 0, // 按照什么规则排序，默认是时间
      options: [
        { value: 0, label: "时间" },
        { value: 1, label: "点赞次数" },
        { value: 2, label: "阅读次数" },
      ],
      radioValue: "2", //默认是降序
    };
  },
  methods: {
    // 初始化数据,obj代表的是排序规则
    initData(searchContent) {
      return this.$axios({
        method: "post",
        url: "/get_allPost",
        params: {
          sort_rule: this.sortValue,
          sort_orderBy: this.radioValue,
          search_content: searchContent,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        },
      })
        .then(res => {
          if (res.data.state === 0) {
            this.allPost = res.data.allPost;
            this.total = res.data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**
     * 初始化supportArr点赞
     */
    initSupportArr() {
      this.$axios({
        method: "get",
        url: "/getSupportArr",
      })
        .then(res => {
          if (res.data.state === 0) {
            // 为supportArr赋值
            this.supportArr = res.data.arr;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**
     * 先判断是否有文章，没有就不运行了
     * 文章内容填充
     * 先把富文本编辑器的带有html标签的内容填充进去，在用innerText进行内容截取
     */
    content() {
      if (this.allPost.length > 0) {
        let arr = this.$refs.post_content;
        arr.forEach((item, index) => {
          item.innerHTML = this.allPost[index].post_content;
          // 先用正则把空格去掉，再进行截取长度，最后加上...当成省略
          item.innerText =
            item.innerText
              .replace(new RegExp("\\s", "g"), "")
              .slice(0, this.contentSlice) + "...";
        });
      }
    },

    /**
     * 记录是否点过赞
     * 如果点过赞则设为未赞样式，
     * 为点过赞设为点赞样式
     */
    toggleClass(post_id, item) {
      this.$axios({
        method: "get",
        url: "/addSupport",
        params: {
          post_id: post_id,
        },
      })
        .then(res => {
          /**
           * state为0代表取消点赞
           * state为1代表点赞
           * state为2代表未登录
           */
          switch (res.data.state) {
            case 0:
              this.supportArr.splice(this.supportArr.indexOf(post_id), 1);
              item.post_praise_count--;
              break;
            case 1:
              this.supportArr.push(post_id);
              item.post_praise_count++;
              break;
            case 2:
              this.$message.warning("请先登录");
              break;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 点击标签传给父组件
    searchPostTag(postTag) {
      this.$emit("searchPostTag", postTag);
    },

    // 当页码改变时，重新请求数据
    async changeCurrentPage(val) {
      this.currentPage = val;
      this.$emit("changePageData", {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
      await this.initData(this.$route.params.content);
      this.content();
    },
  },
  watch: {
    sortValue() {
      this.initData(this.$route.params.content);
    },
    radioValue() {
      this.initData(this.$route.params.content);
    },
  },
  async mounted() {
    setTimeout(async () => {
      await this.initData(this.$route.params.content);
      this.initSupportArr();
      this.content();
    }, 100);
  },
  components: {
    BackTop,
  },
};
</script>

<style lang="scss" scoped>
@import "../common/styles";
.home {
  .sort {
    display: flex;
    margin: 1rem auto 0;
    padding: 1rem;
    width: 60%;
    justify-content: center;
    align-items: center;
    background: $div_bgColor;
    box-sizing: border-box;
    .select-wrapper {
      width: 8rem;
    }
    .sort_orderBy {
      padding-left: 1rem;
    }
    @media screen and (max-width: 768px) {
      width: 100%;
      margin: 0;
    }
  }
  // 内容区
  .container {
    margin: 1rem auto 0;
    width: 60%;
    background-color: $div_bgColor;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    padding: 1rem;
    box-sizing: border-box;
    .post-wrapper {
      .post-item {
        padding: 0.5rem;
        border-radius: 5px;
        border-bottom: $border_bottom;
        .title {
          font-size: 1.3rem;
          padding-bottom: 1rem;
          &:hover {
            color: $tb_color;
          }
        }
        .post_content {
          color: $diy_gary;
          padding-bottom: 1rem;
          font-size: 1rem !important;
          line-height: 1.2rem;
          overflow: hidden;
        }
        .post_footer {
          position: relative;
          .footer_left {
            display: flex;
            align-items: center;
            .avatar {
              width: 1.5rem;
              height: 1.5rem;
              border-radius: 50%;
            }
            .userName,
            .postTag {
              padding-left: 0.5rem;
              vertical-align: super;
              color: rgba(0, 0, 0, 0.7);
              &:hover {
                color: $diy_blue;
              }
            }
            .postTag {
              color: $blue;
            }
          }

          .tools {
            display: flex;
            position: absolute;
            bottom: 0;
            right: 0;
            color: $diy_gary;
            .icon-zhichi,
            .icon-yuedu {
              padding-left: 1rem;
              &:hover {
                color: $diy_blue;
              }
              &::before {
                padding-right: 0.5rem;
              }
            }
            .icon-zhichi {
              &::after {
                display: inline-block;
                vertical-align: top;
                padding-left: 1rem;
                box-sizing: border-box;
                content: "|";
                font-size: 0.8rem;
                color: $diy_gary;
                opacity: 0.3;
              }
            }
            .icon-zhichi.support {
              color: $tb_color;
            }
          }
        }
        &:hover {
          cursor: pointer;
          background: rgba(82, 81, 81, 0.1);
        }
      }
    }
    // 底部分页
    .page_footer {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }
    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
}
</style>
