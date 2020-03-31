import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: JSON.parse(window.sessionStorage.getItem("userInfo"))

  },
  getters: {
    getUserInfo(state) {
      return {
        userInfo: state.userInfo
      }
    }
  },
  mutations: {
    // 设置状态是登录, 和用户id并导入到sessionStorage
    setUserInfo(state, data) {
      let objUserInfo = {
        user_id: data,
        isLogin: true
      };
      state.userInfo = objUserInfo;
      window.sessionStorage.setItem("userInfo", JSON.stringify(objUserInfo));
    }
  },
  modules: {}
});
