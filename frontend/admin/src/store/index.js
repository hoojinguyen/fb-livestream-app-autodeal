import Vue from "vue";
import Vuex from "vuex";

import authentication from "./authentication";
import user from "./user";
import report from "./report";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    authentication,
    user,
    report,
  },
  strict: debug,
});
