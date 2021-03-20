<template>
  <div class="messageCenter_container">
    <header class="header">
      <h1 class="header_title">消息中心</h1>
      <ul class="header_select">
        <li
          v-for="(item, i) in selArr"
          :key="item.key"
          :class="['select_item', activeIndex === i ? 'item_active' : '']"
          @click="selectType(i)"
        >
          {{ item.text }}
        </li>
      </ul>
    </header>
    <main class="messageCenter_main">
      <ul class="main_lists" v-if="listsArr.length > 0">
        <li class="lists_item" v-for="item in listsArr" :key="item.id">
          <p class="item_desc">
            <el-tag class="item_tag" type="success" v-if="item.type === 0"
              >系统</el-tag
            >
            <el-tag class="item_tag" type="info" v-else-if="item.type === 1"
              >评论</el-tag
            >
            <el-tag class="item_tag" type="warning" v-else>点赞</el-tag>
            <template v-if="item.type !== 0">
              <span
                class="item_nickname"
                @click="
                  $router.push({
                    name: 'aboutLink',
                    params: { id: item.from_id },
                  })
                "
                >{{ item.from_username }}</span
              >
              {{ item.type === 1 ? "评论" : "点赞" }}了你的博客
            </template>
          </p>
          <p class="item_postTitle">
            <span
              class="title"
              @click="
                $router.push({
                  name: 'postLink',
                  params: { post_id: item.post_id },
                })
              "
              >{{ item.post_title }}</span
            >
            <span class="date">{{ item.created_time | formateDate }}</span>
          </p>
        </li>
      </ul>
      <h1 class="noData" v-else>暂无消息</h1>
    </main>
  </div>
</template>

<script>
import moment from "moment";
const SelTypes = ["all", "comm", "support", "system"];
export default {
  name: "messageCenter",
  data() {
    return {
      selArr: [
        {
          key: SelTypes[0],
          text: "全部",
        },
        {
          key: SelTypes[1],
          text: "评论",
        },
        {
          key: SelTypes[2],
          text: "点赞",
        },
        {
          key: SelTypes[3],
          text: "系统",
        },
      ],
      activeIndex: 0,
      listsArr: [],
    };
  },
  methods: {
    initData() {
      let userInfo = this.$store.getters.getUserInfo;
      if (!userInfo.isLogin) {
        this.$message.warning("请先登录");
        this.$router.push("/");
        return;
      }
      this.$axios({
        methods: "get",
        url: "/getMessages",
        params: {
          to_id: userInfo.user_id,
          selType: SelTypes[this.activeIndex],
        },
      })
        .then(res => {
          if (res.data.status === 0) {
            this.listsArr = res.data.lists;
            this.$store.commit("setUserInfo", res.data.userInfo);
          }
        })
        .catch(err => console.log(err));
    },
    selectType(index) {
      this.activeIndex = index;
      this.initData();
    },
  },
  mounted() {
    this.initData();
  },
  filters: {
    formateDate(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="scss" socped>
@import "@/common/styles";
.messageCenter_container {
  margin: 16px auto 0;
  width: 60%;
  background: $div_bgColor;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 64px;
    border-bottom: $border_bottom;
    .header_title {
      font-size: 19px;
      font-weight: 600;
    }
    .header_select {
      display: flex;
      .select_item {
        margin-left: 10px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: $tb_color;
        }
        &.item_active {
          color: $tb_color;
        }
      }
    }
  }
  .messageCenter_main {
    padding: 0 24px;
    .main_lists {
      .lists_item {
        padding: 16px 0;
        border-bottom: $border_bottom;
        font-size: 14px;
        .item_desc {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          .item_tag {
            padding: 0 5px;
            height: 20px;
            line-height: 18px;
          }
          .item_nickname {
            display: inline-block;
            margin: 0 8px;
            cursor: pointer;
            color: $diy_blue;
          }
        }
        .item_postTitle {
          display: flex;
          justify-content: space-between;
          .title {
            font-weight: 700;
            cursor: pointer;
            &:hover {
              color: $tb_color;
            }
          }
          .date {
            font-size: 12px;
            color: $diy_gary;
          }
        }
      }
    }
  }
  .noData {
    padding: 24px 0;
  }
}
</style>
