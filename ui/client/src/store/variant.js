import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/variants";

const state = () => ({
  variants: [],
  variant: null,
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
  setVariants(state, payload) {
    state.variants = payload;
  },
  setVariant(state, payload) {
    state.variant = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateVariants(state, payload) {
    const checkExists = state.variants.find((el) => el.id == payload.id);
    if (checkExists) {
      state.variants = state.variants.filter((el) => el.id !== payload.id);
    }

    state.variants.push(payload);
  },
  deleteVariants(state, payload) {
    state.variants = state.variants.filter((variant) => {
      return !payload.find((el) => el == variant.id);
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
          const variants = data.data;
          await commit("setVariants", variants);
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
        const variant = data.data;
        if (status) {
          await commit("setVariant", variant);
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
        const variant = data.data;
        if (status) {
          await commit("updateVariants", variant);
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
        const variant = data.data;
        if (status) {
          await commit("updateVariants", variant);
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
    await customRequest("DELETE", "variants", payload)
      .then(async ({ data }) => {
        const status = data.status;
        const variants = data.data;
        if (status) {
          await commit("deleteVariants", variants);
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
