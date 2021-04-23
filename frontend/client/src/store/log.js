import { request } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/logs";

const actionsLog = {
  connected: (page, user) => {
    return {
      action: "Kết nối",
      description: `Kết nối với page ${page}`,
      reference: page,
      userAction: user,
    };
  },
  disconnected: (page, user) => {
    return {
      action: "Huỷ kết nối",
      description: `Huỷ kết nối với page ${page}`,
      reference: page,
      userAction: user,
    };
  },
  createOrder: (page, user, customer) => {
    return {
      action: "Tạo đơn hàng",
      description: `Tạo mới đơn hàng cho khách ${customer}`,
      reference: page,
      userAction: user,
    };
  },
  createCustomer: (user, page, customer) => {
    return {
      action: "Thêm khách hàng",
      description: `Thêm thành công khách hàng ${customer}`,
      reference: page,
      userAction: user,
    };
  },
};

const state = () => ({
  logs: [],
  isLoading: false,
  isLoadingButton: false,
});

const getters = {};

const mutations = {
  setLoading(state, payload) {
    state.isLoading = payload;
  },
  setLoadingButton(state, payload) {
    state.isLoadingButton = payload;
  },
  setLogs(state, payload) {
    state.logs = payload;
  },
  updateLogs(state, payload) {
    state.logs.push(payload);
  },
};

const actions = {
  async fetchAll({ commit }) {
    await commit("setLoading", true);
    await request
      .get(baseURL)
      .then(async ({ data }) => {
        const status = data.status;
        const logs = data.data;
        if (status) {
          await commit("setLogs", logs);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async create({ commit }, { type, value: { page, user, customer } }) {
    const payload = actionsLog[type](page, user, customer);
    console.log("🚀 ~ create ~ payload", payload);
    await commit("setLoadingButton", true);
    await request
      .post(baseURL, payload)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const log = data.data;
          await commit("updateLogs", log);
        }
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setLoadingButton", false);
        handleError(error);
      });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
