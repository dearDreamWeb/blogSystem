import Vue from "vue";
import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
});
Vue.prototype.$axios = http;