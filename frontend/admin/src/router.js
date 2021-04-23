import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      component: () => import("./pages/Login"),
      name: "Login",
      hidden: true,
    },
    {
      path: "/error",
      component: () => import("./pages/Error"),
      name: "Error",
      hidden: true,
    },
    {
      path: "/access",
      component: () => import("./pages/Access"),
      name: "Access",
      hidden: true,
    },
    {
      path: "/notfound",
      component: () => import("./pages/NotFound"),
      name: "Not Found",
      hidden: true,
    },
    {
      path: "/privacy",
      component: () => import("./pages/Privacy"),
      name: "Privacy",
      hidden: true,
    },
    {
      path: "/",
      name: "Dashboard",
      exact: true,
      component: () => import("./pages/HomePage.vue"),
    },
    {
      path: "/report",
      name: "Report",
      exact: true,
      component: () => import("./pages/Report.vue"),
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
