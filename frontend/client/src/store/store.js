import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/stores";

const state = () => ({
  stores: [],
  store: {
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  },
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
  setStores(state, payload) {
    state.stores = payload;
  },
  setStore(state, payload) {
    state.store = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateStores(state, payload) {
    const checkExists = state.stores.find((el) => el.id == payload.id);
    if (checkExists) {
      state.stores = state.stores.filter((el) => el.id !== payload.id);
    }

    state.stores.push(payload);
  },
  deleteStores(state, payload) {
    state.stores = state.stores.filter((store) => {
      return !payload.find((el) => el == store.id);
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
          const stores = data.data;
          await commit("setStores", stores);
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
          const store = data.data;
          await commit("setStore", store);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async fetchByUserId({ commit }) {
    await commit("setLoading", true);
    await request
      .get(`${baseURL}/user/id`)
      .then(async ({ data }) => {
        console.log("🚀 ~ .then ~ data", data);
        const status = data.status;
        if (status) {
          const store = data.data;
          await commit("setStore", store);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async create({ commit }, payload) {
    await commit("setLoadingButton", true);
    await request
      .post(baseURL, payload)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const store = data.data;
          await commit("setStore", store);
          await commit("updateStores", store);
        }
        await commit("setStatus", { status, type: "create" });
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "create" });
        commit("setLoadingButton", false);
        handleError(error);
      });
  },

  async update({ commit }, payload) {
    await commit("setLoadingButton", true);
    await request
      .put(baseURL, payload)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const store = data.data;
          await commit("setStore", store);
          await commit("updateStores", store);
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
    await customRequest("DELETE", "stores", payload)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const stores = data.data;
          await commit("deleteStores", stores);
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
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
