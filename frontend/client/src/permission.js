import router from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@/utils/auth";
// import { getToken, getFBToken } from "@/utils/auth";
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false });

const whiteList = [
  "/login",
  "/signup",
  "/error",
  "/access",
  "/notfound",
  "/privacy",
  "/forgot-password",
]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  if (!to.name) return next(`/notfound`);

  // start progress bar
  NProgress.start();

  // set page title
  document.title = `${getPageTitle(to.meta.title)} | ${to.name}`;

  const hasToken = getToken();
  if (hasToken) {
    // const fbToken = getFBToken();
    // if (!fbToken && to.path !== "/connect") {
    //   next({ path: "/connect" });
    //   NProgress.done();
    // } else if (fbToken && to.path == "/connect") {
    //   next({ path: "/" });
    //   NProgress.done();
    // }

    if (to.path === "/login" || to.path === "/signup") {
      next({ path: "/" });
      return NProgress.done();
    } else {
      next();
      return NProgress.done();
    }
  } else {
    if (whiteList.includes(to.path)) {
      return next();
    } else {
      next(`/login?redirect=${to.path}`);
      return NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
