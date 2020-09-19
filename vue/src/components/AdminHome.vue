<template>
  <div class="admin_home">
    <header class="header">
      欢迎管理员：<span class="admin_user">{{ adminUsername }}</span>
      当前时间：{{ new Date() | formatDate }}
    </header>
    <section class="data_count">
      <el-row>
        <!-- 用户量 -->
        <el-col
          v-for="(item, index) in dataCount"
          :key="index"
          :md="6"
          class="card_item"
        >
          <el-card
            class="box-card"
            shadow="hover"
            body-style="height:100%;padding:0;"
          >
            <div class="content">
              <i
                :class="item.icon"
                :style="{ backgroundColor: item.bgColor }"
              ></i>
              <div class="right">
                <span :style="{ color: item.bgColor }" class="count">{{
                  item.count
                }}</span>
                <span class="title">{{ item.title }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
    <el-row class="echarts_wrap">
      <!-- 男女比例饼状图 -->
      <el-col :md="12" class="echart_sexPie">
        <div id="sexPie"></div>
      </el-col>
      <!-- 年龄分布的柱状图 -->
      <el-col :md="12" class="echart_ageBar">
        <div id="ageBar"></div>
      </el-col>
      <!-- 每月新用户注册折线图 -->
      <el-col :md="24" class="echart_newUsers">
        <div id="newUsers"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入饼状图组件
require("echarts/lib/chart/pie");
require("echarts/lib/chart/bar");
require("echarts/lib/chart/line");
// 引入提示框和title组件
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");
require("echarts/lib/component/grid");
require("echarts/lib/component/axis");
//引入模型Series
require("echarts/lib/model/Series");
export default {
  props: {
    adminUsername: {
      type: String,
      isRequire: true,
    },
  },
  data() {
    return {
      users: {
        all: 0,
        man: 0,
        woman: 0,
      }, //用户量,all：所有人，man：男人，woman：女人
      views: 0, // 用户访问量
      yearNewUsers: {}, // 近一年新用户注册量的信息
      supports: 0, // 文章点赞量
      comments: 0, //  文章评论量
      ageCategoires: [], //年龄分组，对应["00后", "90后", "80后", "70后", "60后", "60前"]
      // 统计数据
      dataCount: [
        {
          title: "用户量",
          count: 0,
          icon: "el-icon-user",
          bgColor: "#1e9fff",
        },
        {
          title: "用户访问量",
          count: 0,
          icon: "el-icon-view",
          bgColor: "#009688",
        },
        {
          title: "文章点赞量",
          count: 0,
          icon: "iconfont icon-zhichi",
          bgColor: "#e4393c",
        },
        {
          title: "文章评论量",
          count: 0,
          icon: "iconfont icon-pinglun post_footer_item",
          bgColor: "#dab70d",
        },
      ],
    };
  },
  methods: {
    // 初始化DataCount
    initDataCount() {
      this.$axios({
        method: "get",
        url: "/admin/homeData",
      })
        .then(res => {
          if (res.data.status === 0) {
            this.users = res.data.data.users;
            this.views = res.data.data.views;
            this.yearNewUsers = res.data.data.yearNewUsers;
            this.supports = res.data.data.supports;
            this.comments = res.data.data.comments;
            this.ageCategoires = res.data.data.ageCategoires;
          }
        })
        .catch(err => console.log(err));
    },
    // 男女比例饼状图
    sexPie() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("sexPie"));
      let option = {
        color: ["#45b1c2", "#fb748b"],
        title: {
          text: "用户的男女比例",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["男", "女"],
        },
        series: [
          {
            name: "用户的男女比例",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: this.users.man, name: "男" },
              { value: this.users.woman, name: "女" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    // 年龄分布的柱状图
    ageBar() {
      // 百分比年龄段
      let newAgeCate = [];
      // 人数除以总人口数得到百分比年龄段
      this.ageCategoires.forEach(item => {
        let num = (item / this.users.all) * 100;
        newAgeCate.push(num.toFixed(1));
      });

      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("ageBar"));
      let option = {
        title: {
          text: "年龄比例",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "none", // 默认为直线，可选为：'line' | 'shadow'
            show: false,
          },
          // 当鼠标移入的样式
          formatter: val => {
            let perData = val[0].data; // 百分比数据
            let title = val[0].name; // x轴坐标名字
            let index = val[0].dataIndex;
            let count = this.ageCategoires[index]; // 人数数据
            return `
            ${title}<br/>
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#3398DB;"></span>
            百分比：${perData}%<br/>
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#e4393c;"></span>
            人数：${count}
            `;
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["00后", "90后", "80后", "70后", "60后", "60前"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              show: true,
              interval: "auto",
              formatter: "{value}%", // y轴数值百分比
            },
          },
        ],
        series: [
          {
            name: "",
            type: "bar",
            barWidth: "40%",
            data: newAgeCate,
            label: {
              show: true,
              position: "top",
              formatter: "{c}%",
            },
            showBackground: true,
            // 每个柱状图的颜色不同
            itemStyle: {
              normal: {
                color: function(params) {
                  let colors = [
                    "#3398DB",
                    "#e4393c",
                    "#009688",
                    "#dab70d",
                    "#d908dc",
                    "#0db6c7",
                  ];
                  return colors[params.dataIndex];
                },
              },
            },
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    // 每月新用户注册折线图
    newUser() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("newUsers"));
      let option = {
        title: {
          text: "近一年新用户注册人数",
          left: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: Object.keys(this.yearNewUsers),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: Object.values(this.yearNewUsers),
            type: "line",
            itemStyle: {
              color: "#45b1c2",
            },
            areaStyle: {},
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
  filters: {
    formatDate(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  mounted() {
    this.$nextTick(async () => {
      await this.initDataCount();
    });
  },
  watch: {
    users(val) {
      this.dataCount[0].count = val.all;
      this.sexPie();
    },
    views(val) {
      this.dataCount[1].count = val;
    },
    supports(val) {
      this.dataCount[2].count = val;
    },
    comments(val) {
      this.dataCount[3].count = val;
    },
    yearNewUsers() {
      this.newUser();
    },
    ageCategoires() {
      this.ageBar();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../common/styles/index.scss";
.admin_home {
  .header {
    position: relative;
    padding: 15px 10px;
    font-size: 14px;
    background-color: $div_bgColor;
    border-radius: 3px;
    .admin_user {
      color: $tb_color;
    }
    &::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 3px;
      height: 100%;
      background-color: $blue;
    }
  }
  // 数量统计
  .data_count {
    margin-top: 20px;
    .card_item {
      padding: 0 10px;
      .box-card {
        height: 100px;
        .content {
          display: flex;
          height: 100%;
          i {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            height: 100%;
            font-size: 50px;
            color: $div_bgColor;
          }
          .right {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .count {
              padding-bottom: 10px;
              font-size: 30px;
              font-weight: 700;
            }
            .title {
              font-size: 14px;
              color: $diy_gary;
            }
          }
        }
      }
    }
  }
  // echarts数据统计表
  .echarts_wrap {
    margin-top: 30px;
    .echart_sexPie,
    .echart_ageBar,
    .echart_newUsers {
      padding: 10px;
      height: 400px;
      border-radius: 3px;
      #sexPie,
      #ageBar,
      #newUsers {
        padding: 10px;
        height: 100%;
        background-color: $div_bgColor;
      }
    }
  }
}
</style>
