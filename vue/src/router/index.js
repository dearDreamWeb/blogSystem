import Vue from "vue";
import VueRouter from "vue-router";
const Home = () => import("@/views/Home.vue");
const About = () => import("@/views/About.vue");
const EditPost = () => import("@/views/EditPost.vue");
const Error = () => import("@/views/404.vue");
const Post = () => import("@/views/Post.vue");
const AdminLogin = () => import("@/views/AdminLogin.vue");
const Admin = () => import("@/views/Admin.vue");
const AdminHome = () => import("@/components/AdminHome.vue");
const AdminPostLists = () => import("@/components/AdminPostLists.vue");


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "homeLink",
    component: Home
  },
  // 查询标题或内容
  {
    path: "/search/:content",
    name: "searchLink",
    component: Home
  },
  // 个人首页
  {
    path: "/about/:id",
    name: "aboutLink",
    component: About
  },
  // 编辑文章界面
  {
    path: "/editPost",
    name: "editPostLink",
    component: EditPost
  },
  // 某个文章
  {
    path: "/post/:post_id",
    name: "postLink",
    component: Post
  },
  // 管理员登录界面
  {
    path: "/admin_login",
    name: "adminLogin",
    component: AdminLogin
  },
  // 后台管理界面
  {
    path: "/admin",
    name: "admin",
    component: Admin,
    redirect: "/admin/home",
    children: [
      {
        path: "home",
        name: "adminHome",
        component: AdminHome,
      },
      {
        path: "post_lists",
        name: "adminPostLists",
        component: AdminPostLists,
      },
      {
        path: "users",
        name: "users",
        component: AdminHome,
      },
      {
        path: "admin_users",
        name: "adminUsers",
        component: AdminHome,
      }]
  },
  // 404
  {
    path: "*",
    name: "errorLink",
    component: Error
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router;
