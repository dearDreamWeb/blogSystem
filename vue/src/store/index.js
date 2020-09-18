import Vue from "vue";
import Vuex from "vuex";
import Store from "../utils/storage";

Vue.use(Vuex);
const store = new Store("sessionStorage");

export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: store.getItem("userInfo"),
    // 管理员账号
    adminUsername: store.getItem("adminUsername")

  },
  getters: {
    getUserInfo(state) {
      return {
        userInfo: state.userInfo
      }
    },
    getAdminUsername(state) {
      return state.adminUsername
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
      store.setItem("userInfo", objUserInfo);
    },
    // 设置管理员账号
    setAdminUsername(state, data) {
      state.adminUsername = data;
      store.setItem("adminUsername", data);
    }
  },
  modules: {}
});
