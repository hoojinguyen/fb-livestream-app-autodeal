import { request } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/users";

const state = () => ({
  user: {},
  status: {
    create: false,
    update: false,
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
  setUser(state, payload) {
    state.user = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
};

const actions = {
  async fetchById({ commit }) {
    await commit("setLoading", true);
    await request
      .get(`${baseURL}/id`)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const user = data.data;
          await commit("setUser", user);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
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
          const user = data.data;
          await commit("setUser", user);
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
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
