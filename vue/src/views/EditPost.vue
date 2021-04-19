<template>
  <div class="editPost">
    <div class="container">
      <!-- 文章标题 -->
      <div class="post_header">
        <h2 class="post_title">博客标题</h2>
        <el-input
          class="post_titleContent"
          v-model="title"
          placeholder="请输入博客标题"
          clearable
        >
          <!-- 计算标题的字数限制 -->
          <template slot="append">{{
            countTitle.length === 0 ? `0/${title_maxLength}` : countTitle
          }}</template>
        </el-input>
      </div>

      <!-- 文章标题选择 -->
      <section class="tag_container">
        <h2 class="post_tag">博客分类</h2>
        <template v-if="tagsArr.length > 0">
          <el-radio
            v-for="item in tagsArr"
            :key="item.cate_id"
            v-model="radio"
            :label="item.cate_id"
            class="tag_item"
          >
            <el-tag :type="item.cate_id === radio ? '' : 'success'">{{
              item.cate_name
            }}</el-tag></el-radio
          >
        </template>
        <el-button size="small" @click="centerDialogVisible = true"
          >自定义分类</el-button
        >
        <!-- 添加自定义标签的对话框 -->
        <el-dialog
          title="自定义分类"
          :visible.sync="centerDialogVisible"
          width="30%"
          center
        >
          <div class="dialog_content">
            <p style="padding-bottom:10px">分类名称</p>
            <el-input
              v-model="diyTag"
              placeholder="请输入自定义的分类名称"
              @keydown.enter.native="addDiyTag"
            ></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDiyTag">确 定</el-button>
          </span>
        </el-dialog>
      </section>

      <!-- 文章内容 -->
      <div id="wangeditor">
        <h2 class="post_contentHeader">博客内容</h2>
        <div ref="editorElem" class="editorElem"></div>
      </div>

      <!-- 提交 -->
      <div class="btn">
        <el-button type="danger" plain @click="submit">发布博客</el-button>
      </div>
    </div>
    <!-- 回到顶部 -->
    <back-top></back-top>
  </div>
</template>

<script>
// @ is an alias to /src
import E from "wangeditor";
import BackTop from "@/components/BackTop";

export default {
  data() {
    return {
      editor: null,
      editorContent: "",
      title: "",
      title_maxLength: 30, //文章标题最大长度
      countTitle: "", //显示标题剩余的字数
      radio: 0, // 文章标签选择的值
      centerDialogVisible: false, // 是否显示对话框
      diyTag: "", // 自定义标签名称
      // 文章标签数组
      tagsArr: [],
    };
  },
  methods: {
    /**
     * 如果是修改博客初始化博客信息
     */
    async initPostInfo() {
      const { post_id } = this.$route.params;
      await this.$axios({
        method: "get",
        url: "/admin/postLists",
        params: {
          selectedValue: 0,
          keyWord: post_id,
          currentPage: 1,
          pageSize: 1,
        },
      })
        .then(res => {
          // 填充标题标签
          if (res.data.status === 0 && res.data.allPost.length > 0) {
            const { post_content, post_title, post_tag } = res.data.allPost[0];
            this.editorContent = post_content;
            this.editor.txt.html(this.editorContent);
            this.title = post_title;
            this.diyTag = post_tag.replaceAll("#", "");
            // 当标签为默认标签的话，直接选择，反之调用addDiyTag添加分类
            let isDefaultTag = true;
            this.tagsArr.forEach(item => {
              if (post_tag === item.cate_name) {
                this.radio = item.cate_id;
                isDefaultTag = false;
              }
            });
            isDefaultTag && this.addDiyTag();
          } else {
            this.$router.push("/");
            this.$message.info("编辑博客错误");
          }
        })
        .catch(err => console.log(err));
    },
    /**
     * 初始化wangeditor富文本编辑器
     */
    initWangEditor() {
      return new Promise(resolve => {
        this.editor = new E(this.$refs.editorElem);
        this.editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
        // 编辑器的事件，每次改变会获取其html内容
        this.editor.customConfig.onchange = html => {
          this.editorContent = html;
          this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
        };
        this.editor.customConfig.menus = [
          // 菜单配置
          "head", // 标题
          "bold", // 粗体
          "fontSize", // 字号
          "fontName", // 字体
          "italic", // 斜体
          "underline", // 下划线
          "strikeThrough", // 删除线
          "foreColor", // 文字颜色
          "backColor", // 背景颜色
          "link", // 插入链接
          "list", // 列表
          "justify", // 对齐方式
          "quote", // 引用
          "emoticon", // 表情
          "image", // 插入图片
          "table", // 表格
          // "code", // 插入代码
          "undo", // 撤销
          "redo", // 重复
        ];
        this.editor.create(); // 创建富文本实例
        resolve();
      });
    },

    /**
     * 提交数据
     */
    submit() {
      let type = this.$route.params.post_id ? "updatePost" : "addPost"; // 获取是添加还是修改博客
      // 先校验文章的标题和内容是否为空，都不为空再提交数据
      let reg = /^\s+$/;
      if (!reg.test(this.title) && !this.editorContent == false) {
        this.$confirm("是否确定发布", "提示")
          .then(() => {
            let url = type === "addPost" ? "/setPost" : "/updatePost";
            this.$axios({
              method: "post",
              url,
              data: {
                title: this.title,
                content: this.editorContent,
                cate_id: this.radio,
                post_id: this.$route.params.post_id,
              },
            })
              .then(res => {
                if (res.data.state === 0) {
                  this.$message.success(
                    `${type === "addPost" ? "发布" : "修改"}成功`
                  );
                  this.title = "";
                  this.editorContent = "";
                  document.querySelector(".w-e-text").innerHTML = "";
                  this.$router.push("/");
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            this.$message.info(`已取消${type === "addPost" ? "发布" : "修改"}`);
          });
      } else {
        this.$message.error("文章标题和内容不能为空");
      }
    },

    /**
     * 修改一些wangeditor富文本编辑器的样式
     * 让工具栏实现自动换行
     * 把z-index调低，为了确认框窗口不会被遮挡
     */
    changeEditorStyle() {
      // 让工具栏实现自动换行
      document.querySelector(".w-e-toolbar").style.flexWrap = "wrap";
      // 修改内容区的z-index
      document.querySelector(".w-e-text-container").style.zIndex = "0";
      // 修改工具栏中所有工具的z-index
      let arr = Array.from(document.querySelectorAll(".w-e-menu"));
      arr.forEach(item => {
        item.style.zIndex = "1";
      });
    },

    // 添加自定义标签
    addDiyTag() {
      this.$axios({
        method: "post",
        url: "/category/add",
        data: {
          cate_name: `#${this.diyTag}#`,
        },
      })
        .then(res => {
          if (res.data.state === 0) {
            this.tagsArr.push(res.data.cateData);
            this.radio = this.tagsArr[this.tagsArr.length - 1].cate_id;
          } else {
            this.$message.info(res.data.msg);
          }
        })
        .catch(err => console.log(err));

      this.centerDialogVisible = false;
    },
    // 获取分类数据
    queryCateData() {
      return this.$axios({
        method: "get",
        url: "/category/queryDefault",
      })
        .then(res => {
          if (res.data.state === 0) {
            this.tagsArr = res.data.list;
          }
        })
        .catch(err => console.log(err));
    },
  },
  watch: {
    // 计算限制的字数剩余多少，并给countTitle赋值
    title() {
      let result = this.title_maxLength - this.title.length;
      if (result >= 0) {
        this.countTitle = `${result}/${this.title_maxLength}`;
      } else {
        this.title = this.title.slice(0, this.title_maxLength);
        this.$message.warning("文章标题超过最大长度");
      }
    },
  },
  async mounted() {
    await this.queryCateData();
    await this.initWangEditor();
    await this.changeEditorStyle();
    // 如果post_id存在说明是要修改博客
    this.$route.params.post_id && this.initPostInfo();
  },
  beforeRouteEnter(to, from, next) {
    // 如果未登录返回首页，提示用户登录
    next(vm => {
      let isLogin = vm.$store.getters.getUserInfo;
      isLogin
        ? true
        : vm.$router.push({ name: "homeLink" }) &&
          vm.$message.warning("请先登录");
    });
  },
  components: {
    BackTop,
  },
};
</script>

<style scoped lang="scss">
@import "../common/styles";
.editPost {
  .container {
    margin: 0 auto;
    width: 60%;
    background-color: $div_bgColor;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    padding: 1rem;
    .post_header {
      padding: 1rem 0;
      .post_title {
        font-size: 1.5rem;
        padding: 1rem 0;
      }
    }
    // 文章标题选择
    .tag_container {
      .post_tag {
        font-size: 1.5rem;
        padding: 1rem 0;
      }
      .tag_item {
        margin-bottom: 10px;
      }
    }
    #wangeditor {
      padding-top: 1rem;
      .post_contentHeader {
        font-size: 1.5rem;
        padding-bottom: 1rem;
      }
    }
    .btn {
      padding-top: 1rem;
    }
    @media screen and (max-width: 768px) {
      width: auto;
      padding: 0;
    }
  }
}
</style>
