/* eslint-disable */

import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/users";

const state = () => ({
  users: [],
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
  setUsers(state, payload) {
    state.users = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  deleteUsers(state, payload) {
    state.users = state.users.filter((user) => {
      return !payload.find((el) => el == user.id);
    });
  },
};

const actions = {
  async fetchAll({ commit }) {
    await commit("setLoading", true);
    await request
      .get(`${baseURL}`)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const users = data.data;
          await commit("setUsers", users);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async lockUser({ commit }, payload) {
    await request.post("/lock/users", payload).catch((error) => {
      handleError(error);
    });
  },

  async unlockUser({ commit }, payload) {
    await request.post("/unlock/users", payload).catch((error) => {
      handleError(error);
    });
  },

  async delete({ commit }, payload) {
    await commit("setLoadingButton", true);
    await customRequest("DELETE", "users", payload)
      .then(async ({ data }) => {
        const status = data.status;
        const products = data.data;
        if (status) {
          await commit("deleteUsers", products);
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
