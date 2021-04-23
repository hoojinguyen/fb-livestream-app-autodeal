import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/orders";

const state = () => ({
  orders: [],
  ordersTemp: [],
  order: null,
  status: {
    create: false,
    update: false,
    delete: false,
  },
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
  setOrders(state, payload) {
    state.orders = payload;
    state.ordersTemp = payload;
  },
  setOrder(state, payload) {
    state.order = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateOrders(state, payload) {
    const checkExists = state.orders.find((el) => el.id == payload.id);
    if (checkExists) {
      state.orders = state.orders.filter((el) => el.id !== payload.id);
    }

    state.orders.push(payload);
  },
  deleteOrders(state, payload) {
    state.orders = state.orders.filter((order) => {
      return !payload.find((el) => el == order.id);
    });
  },

  filterOrders(state, { status, orders }) {
    if (status < 0) {
      state.orders = orders;
    } else if (status == 1) {
      state.orders = orders.filter((el) => [1, 2, 3].includes(el.status));
    } else {
      state.orders = orders.filter((el) => el.status == status);
    }
  },
};

const actions = {
  async fetchAll({ commit }) {
    await commit("setLoading", true);
    await request
      .get(baseURL)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const orders = data.data;
          await commit("setOrders", orders);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async fetchAllByLivestreamId({ commit }, { id }) {
    await commit("setLoading", true);
    await request
      .get(`${baseURL}/livestream/${id}`)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const orders = data.data;
          await commit("setOrders", orders);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async fetchAllByCustomerId({ commit }, { customerId }) {
    await commit("setLoading", true);
    await request
      .get(`${baseURL}/customer/${customerId}`)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const orders = data.data;
          await commit("setOrders", orders);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async fetchById({ commit }, { id }) {
    await commit("setLoading", true);
    await request
      .get(`${baseURL}/${id}`)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const order = data.data;
          await commit("setOrder", order);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async create({ commit }, payload) {
    let res = null;
    await commit("setLoadingButton", true);
    await request
      .post(`${baseURL}/create`, payload)
      .then(async ({ data }) => {
        res = data;
        const status = data.status;
        if (status) {
          const order = data.data;
          await commit("setOrder", order);
        }
        await commit("setStatus", { status, type: "create" });
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "create" });
        commit("setLoadingButton", false);
        res = handleError(error);
      });
    return res;
  },

  async update({ commit }, payload) {
    let res = null;
    await commit("setLoadingButton", true);
    await request
      .post(`${baseURL}/update`, payload)
      .then(async ({ data }) => {
        res = data;
        await commit("setStatus", { status, type: "update" });
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "update" });
        commit("setLoadingButton", false);
        res = handleError(error);
      });
    return res;
  },

  async cancel({ commit }, payload) {
    let res = null;
    await commit("setLoadingButton", true);
    await request
      .post(`${baseURL}/cancel`, payload)
      .then(async ({ data }) => {
        res = data;
        await commit("setStatus", { status, type: "update" });
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "update" });
        commit("setLoadingButton", false);
        res = handleError(error);
      });
    return res;
  },

  async delete({ commit }, payload) {
    let res = null;
    await commit("setLoadingButton", true);
    await customRequest("DELETE", "orders", payload)
      .then(async ({ data }) => {
        res = data;
        await commit("setStatus", { status, type: "delete" });
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "delete" });
        commit("setLoadingButton", false);
        res = handleError(error);
      });
    return res;
  },

  async deleteDetails({ commit }, payload) {
    let res = null;
    await commit("setLoadingButton", true);
    await customRequest("DELETE", "orders/details", payload)
      .then(async ({ data }) => {
        res = data;
        await commit("setStatus", { status, type: "delete" });
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "delete" });
        commit("setLoadingButton", false);
        res = handleError(error);
      });
    return res;
  },

  async updateShipping({ commit }, payload) {
    let res = null;
    await request
      .put("/shippings", payload)
      .then(async ({ data }) => {
        res = data;
        await commit("setStatus", { status, type: "update" });
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "update" });
        commit("setLoadingButton", false);
        res = handleError(error);
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
