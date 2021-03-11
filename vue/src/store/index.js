import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: {},
    // 管理员账号
    adminUsername: ''
  },
  getters: {
    getUserInfo(state) {
      return {
        userInfo: state.userInfo
      }
    },
    getAdminUsername(state) {
      return state.adminUsername;
    }
  },
  mutations: {
    // 设置状态是登录, 和用户id并导入到sessionStorage
    setUserInfo(state, data) {
      let objUserInfo = {
        ...data,
        isLogin: true
      };
      state.userInfo = objUserInfo;
    },
    // 退出登录
    loginOut(state) {
      state.userInfo = {};
    },
    // 设置管理员账号
    setAdminUsername(state, data) {
      state.adminUsername = data;
    }
  },
  modules: {}
});
