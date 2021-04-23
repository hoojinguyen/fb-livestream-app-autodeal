import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/syntaxes";

const state = () => ({
  syntaxes: [],
  syntax: null,
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
  setSyntaxes(state, payload) {
    state.syntaxes = payload;
  },
  setSyntax(state, payload) {
    state.syntax = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateSyntaxes(state, payload) {
    const checkExists = state.syntaxes.find((el) => el.id == payload.id);
    if (checkExists) {
      state.syntaxes = state.syntaxes.filter((el) => el.id !== payload.id);
    }

    state.syntaxes.push(payload);
  },
  deleteSyntaxes(state, payload) {
    state.syntaxes = state.syntaxes.filter((syntax) => {
      return !payload.find((el) => el == syntax.id);
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
          const syntaxes = data.data;
          await commit("setSyntaxes", syntaxes);
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
        const syntax = data.data;
        if (status) {
          await commit("setSyntax", syntax);
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
        const syntax = data.data;
        if (status) {
          await commit("updateSyntaxes", syntax);
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
        const syntax = data.data;
        if (status) {
          await commit("updateSyntaxes", syntax);
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
    await customRequest("DELETE", "syntaxes", payload)
      .then(async ({ data }) => {
        const status = data.status;
        const syntaxes = data.data;
        if (status) {
          await commit("deleteSyntaxes", syntaxes);
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
