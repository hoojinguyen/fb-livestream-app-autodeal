import Vue from "vue";
import Vuex from "vuex";

import authentication from "./authentication";
import user from "./user";
import facebook from "./facebook";
import livestream from "./livestream";
import post from "./post";
import warehouse from "./warehouse";
import warehouseImport from "./warehouseImport";
import warehouseExport from "./warehouseExport";
import warehouseInventory from "./warehouseInventory";

import variant from "./variant";
import carrier from "./carrier";
import coupon from "./coupon";
import customer from "./customer";
import customerGroup from "./customerGroup";
import order from "./order";
import product from "./product";
import category from "./category";
import productGroup from "./productGroup";
import sale from "./sale";
import store from "./store";
import syntax from "./syntax";
import unit from "./unit";
import log from "./log";
import note from "./note";
import commentSample from "./commentSample";
import messageSample from "./messageSample";
import report from "./report";

import upload from "./upload";
import chatbot from "./chatbot";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    authentication,
    user,
    facebook,
    livestream,
    post,
    variant,
    carrier,
    coupon,
    customer,
    customerGroup,
    order,
    product,
    productGroup,
    category,
    sale,
    store,
    syntax,
    unit,
    log,
    note,
    commentSample,
    messageSample,
    upload,
    warehouse,
    warehouseImport,
    warehouseExport,
    warehouseInventory,
    chatbot,
    report,
  },
  strict: debug,
});
