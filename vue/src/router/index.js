import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import EditPost from "../views/EditPost.vue";

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
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
