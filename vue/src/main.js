import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./axios";
import "./element-ui";
import "./common/font/iconfont.css";
import "animate.css";

Vue.config.productionTip = false;

const vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

export default vue;