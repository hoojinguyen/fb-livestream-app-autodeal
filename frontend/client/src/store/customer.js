import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/customers";

const state = () => ({
  customers: [],
  customer: null,
  customersBlock: [],
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
  setCustomersBlock(state, payload) {
    state.customersBlock = payload;
  },
  setCustomers(state, payload) {
    state.customers = payload;
  },
  setCustomer(state, payload) {
    state.customer = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateCustomers(state, payload) {
    const checkExists = state.customers.find((el) => el.id == payload.id);
    if (checkExists) {
      state.customers = state.customers.filter((el) => el.id !== payload.id);
    }

    state.customers.push(payload);
  },
  deleteCustomers(state, payload) {
    state.customers = state.customers.filter((customer) => {
      return !payload.find((el) => el == customer.id);
    });
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
          const customers = data.data;
          await commit("setCustomers", customers);
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
          const customer = data.data;
          await commit("setCustomer", customer);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async fetchByFacebookId({ commit }, { id }) {
    let res = null;
    await commit("setLoading", true);
    await request
      .get(`${baseURL}/facebook/${id}`)
      .then(async ({ data }) => {
        res = data;
        const status = data.status;
        if (status) {
          const customer = data.data;
          await commit("setCustomer", customer);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        res = handleError(error);
        commit("setLoading", false);
      });
    return res;
  },

  async fetchByPhone({ commit }, { phone }) {
    let res = null;
    await commit("setLoading", true);
    await request
      .get(`${baseURL}/phone/${phone}`)
      .then(async ({ data }) => {
        res = data;
      })
      .catch((error) => {
        res = handleError(error);
      });
    return res;
  },

  async create({ commit }, payload) {
    let res = null;
    await commit("setLoadingButton", true);
    await request
      .post(baseURL, payload)
      .then(async ({ data }) => {
        res = data;
        const status = data.status;
        if (status) {
          const customer = data.data;
          await commit("updateCustomers", customer);
          await commit("setCustomer", customer);
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
    await commit("setLoadingButton", true);
    await request
      .put(baseURL, payload)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const customer = data.data;
          await commit("updateCustomers", customer);
          await commit("setCustomer", customer);
        }
        await commit("setStatus", { status, type: "update" });
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "update" });
        commit("setLoadingButton", false);
        handleError(error);
      });
  },

  async delete({ commit }, payload) {
    await commit("setLoadingButton", true);
    await customRequest("DELETE", "customers", payload)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const customers = data.data;
          await commit("deleteCustomers", customers);
        }
        await commit("setStatus", { status, type: "delete" });
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "delete" });
        commit("setLoadingButton", false);
        handleError(error);
      });
  },

  async fetchCustomerBlock({ commit }) {
    let res = null;
    await commit("setLoading", true);
    await request
      .get("/block/customers")
      .then(async ({ data }) => {
        res = data;
        const status = data.status;
        if (status) {
          const customers = data.data;
          await commit("setCustomersBlock", customers);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        res = handleError(error);
      });
    return res;
  },

  /* eslint-disable */
  async cancelCustomerBlock({ commit }, payload) {
    let res = null;
    await customRequest("DELETE", "block/customers/hard", payload)
      .then(async ({ data }) => {
        res = data;
      })
      .catch((error) => {
        res = handleError(error);
      });
    return res;
  },

  /* eslint-disable */
  async blockCustomer({ commit }, payload) {
    let res = null;
    await request
      .post("/block/customers", payload)
      .then(async ({ data }) => {
        res = data;
      })
      .catch((error) => {
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
