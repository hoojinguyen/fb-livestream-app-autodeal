import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/product/groups";

const state = () => ({
  productGroups: [],
  productGroup: null,
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
  setProductGroups(state, payload) {
    state.productGroups = payload;
  },
  setProductGroup(state, payload) {
    state.productGroup = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateProductGroups(state, payload) {
    const checkExists = state.productGroups.find((el) => el.id == payload.id);
    if (checkExists) {
      state.productGroups = state.productGroups.filter(
        (el) => el.id !== payload.id
      );
    }

    state.productGroups.push(payload);
  },
  deleteProductGroups(state, payload) {
    state.productGroups = state.productGroups.filter((pGroup) => {
      return !payload.find((el) => el == pGroup.id);
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
        const productGroups = data.data;
        if (status) {
          await commit("setProductGroups", productGroups);
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
        const productGroup = data.data;
        if (status) {
          await commit("setProductGroup", productGroup);
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
        const productGroup = data.data;
        if (status) {
          await commit("updateProductGroups", productGroup);
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
        const productGroup = data.data;
        if (status) {
          await commit("updateProductGroups", productGroup);
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
    await customRequest("DELETE", "product/groups", payload)
      .then(async ({ data }) => {
        const status = data.status;
        const productGroups = data.data;
        if (status) {
          await commit("deleteProductGroups", productGroups);
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
