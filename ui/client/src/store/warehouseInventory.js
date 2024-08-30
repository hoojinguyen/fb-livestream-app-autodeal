import { request } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/warehouse/inventory";

const state = () => ({
  inventories: [],
  isLoading: false,
});

const getters = {};

const mutations = {
  setLoading(state, payload) {
    state.isLoading = payload;
  },

  setInventories(state, payload) {
    state.inventories = payload;
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
          const inventories = data.data;
          await commit("setInventories", inventories);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
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
