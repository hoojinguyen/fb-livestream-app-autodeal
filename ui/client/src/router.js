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
      path: "/signup",
      component: () => import("./pages/SignUp"),
      name: "Sign Up",
      hidden: true,
    },
    {
      path: "/forgot-password",
      component: () => import("./pages/ForgotPassword"),
      name: "Forgot Password",
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
      path: "/order/detail/:id",
      component: () => import("./pages/OrderDetail"),
      name: "Order Detail",
      hidden: true,
    },
    {
      path: "/connect",
      name: "Connect",
      exact: true,
      component: () => import("./pages/Connect.vue"),
    },
    {
      path: "/",
      name: "Dashboard",
      exact: true,
      component: () => import("./pages/HomePage.vue"),
    },
    {
      path: "/sale",
      name: "Sale",
      exact: true,
      component: () => import("./pages/Sale.vue"),
    },
    {
      path: "/livestream/video/detail/:id",
      name: "Livestream Detail",
      exact: true,
      component: () => import("./pages/LivestreamDetail.vue"),
    },
    {
      path: "/livestream/videos",
      name: "Video",
      exact: true,
      component: () => import("./pages/VideoLivestream.vue"),
    },
    {
      path: "/livestream/syntaxes",
      name: "Syntax Setting",
      exact: true,
      component: () => import("./pages/Syntax.vue"),
    },
    {
      path: "/livestream/product-groups",
      name: "Product Groups",
      exact: true,
      component: () => import("./pages/ProductGroup.vue"),
    },
    {
      path: "/orders",
      name: "Order List",
      exact: true,
      component: () => import("./pages/OrderList.vue"),
    },
    {
      path: "/marketing",
      name: "Marketing",
      exact: true,
      component: () => import("./pages/Marketing.vue"),
    },
    {
      path: "/post",
      name: "Post",
      exact: true,
      component: () => import("./pages/Post.vue"),
    },
    {
      path: "/messenger",
      name: "Messenger",
      exact: true,
      component: () => import("./pages/Messenger.vue"),
    },
    {
      path: "/warehouse/import",
      name: "Import WareHouse",
      exact: true,
      component: () => import("./pages/WareHouseImport.vue"),
    },
    {
      path: "/warehouse/export",
      name: "Export WareHouse",
      exact: true,
      component: () => import("./pages/WareHouseExport.vue"),
    },
    {
      path: "/warehouse/inventory",
      name: "Inventory WareHouse",
      exact: true,
      component: () => import("./pages/WareHouseInventory.vue"),
    },
    {
      path: "/manage/products",
      name: "Products",
      exact: true,
      component: () => import("./pages/Product.vue"),
    },
    {
      path: "/manage/categories",
      name: "Categories",
      exact: true,
      component: () => import("./pages/Category.vue"),
    },
    {
      path: "/manage/units",
      name: "Units",
      exact: true,
      component: () => import("./pages/Unit.vue"),
    },
    {
      path: "/manage/customers",
      name: "Customers",
      exact: true,
      component: () => import("./pages/Customer.vue"),
    },
    {
      path: "/manage/groups-customer",
      name: "Groups Customer",
      exact: true,
      component: () => import("./pages/CustomerGroup.vue"),
    },
    {
      path: "/manage/carriers",
      name: "Carriers",
      exact: true,
      component: () => import("./pages/Carrier.vue"),
    },
    {
      path: "/posts",
      name: "Posts",
      exact: true,
      component: () => import("./pages/Post.vue"),
    },
    {
      path: "/blocklist",
      name: "Block List",
      exact: true,
      component: () => import("./pages/BlockList.vue"),
    },
    {
      path: "/chatbot",
      name: "Chatbot",
      exact: true,
      component: () => import("./pages/ChatBot.vue"),
    },
    {
      path: "/setting",
      name: "Setting",
      exact: true,
      component: () => import("./pages/Setting.vue"),
    },
    {
      path: "/report",
      name: "Report",
      exact: true,
      component: () => import("./pages/Report.vue"),
    },
    {
      path: "/auditinglog",
      name: "Auditing Log",
      exact: true,
      component: () => import("./pages/AuditingLog.vue"),
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
