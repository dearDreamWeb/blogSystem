import Vue from "vue";
import axios from "axios";
import context from '../main';
import router from '../router';
import ElementUI from 'element-ui';

const http = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
});

// 请求响应拦截器
http.interceptors.response.use(function (response) {
    let userInfo = context.$store.getters.getUserInfo;
    // 当errCode为0时，说明没有登录
    if (response.data.errCode === 0 && userInfo.isLogin) {
        context.$store.commit("loginOut");
        router.push('/');
        ElementUI.Message.info('请先登录');
    }
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    console.log(error);
});
Vue.prototype.$axios = http;