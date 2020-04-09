import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import EditPost from "../views/EditPost.vue";
import Error from "../views/404.vue";
import Post from "../views/Post.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "homeLink",
    component: Home
  },
  {
    path: "/about/:id",
    name: "aboutLink",
    component: About
  },
  {
    path: "/editPost",
    name: "editPostLink",
    component: EditPost
  },
  {
    path: "/post/:post_id",
    name: "postLink",
    component: Post
  },
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
