import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/categories";

const state = () => ({
  categories: [],
  category: null,
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
  setCategories(state, payload) {
    state.categories = payload;
  },
  setCategory(state, payload) {
    state.category = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateCategories(state, payload) {
    const checkExists = state.categories.find((el) => el.id == payload.id);
    if (checkExists) {
      state.categories = state.categories.filter((el) => el.id !== payload.id);
    }

    state.categories.push(payload);
  },
  deleteCategories(state, payload) {
    state.categories = state.categories.filter((category) => {
      return !payload.find((el) => el == category.id);
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
        const categories = data.data;
        if (status) {
          await commit("setCategories", categories);
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
        const category = data.data;
        if (status) {
          await commit("setCategory", category);
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
        const category = data.data;
        if (status) {
          await commit("updateCategories", category);
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
        const category = data.data;
        if (status) {
          await commit("updateCategories", category);
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
    await customRequest("DELETE", "categories", payload)
      .then(async ({ data }) => {
        const status = data.status;
        const categories = data.data;
        if (status) {
          await commit("deleteCategories", categories);
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
