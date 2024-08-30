/* eslint-disable */
import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/reports";

const state = () => ({
  orders: null,
  products: null,
});

const getters = {};

const mutations = {
  setOrderReport(state, payload) {
    state.orders = payload;
  },
  setProductReport(state, payload) {
    state.products = payload;
  },
};

const actions = {
  async fetchByOrder({ commit }, payload) {
    let res = null;
    await request
      .post(`${baseURL}/order`, payload)
      .then(({ data }) => {
        const status = data.status;
        if (status) {
          res = data.data;
        }
      })
      .catch((error) => {
        handleError(error);
      });
    return res;
  },

  async fetchByProduct({ commit }, payload) {
    let res = null;
    await request
      .post(`${baseURL}/product`, payload)
      .then(({ data }) => {
        const status = data.status;
        if (status) {
          res = data.data;
        }
      })
      .catch((error) => {
        handleError(error);
      });
    return res;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
