import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/carriers";

const state = () => ({
  carriers: [],
  carrier: null,
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
  setCarriers(state, payload) {
    state.carriers = payload;
  },
  setCarrier(state, payload) {
    state.carrier = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateCarriers(state, payload) {
    const checkExists = state.carriers.find((el) => el.id == payload.id);
    if (checkExists) {
      state.carriers = state.carriers.filter((el) => el.id !== payload.id);
    }

    state.carriers.push(payload);
  },
  deleteCarriers(state, payload) {
    state.carriers = state.carriers.filter((carrier) => {
      return !payload.find((el) => el == carrier.id);
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
          const carriers = data.data;
          await commit("setCarriers", carriers);
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
          const carrier = data.data;
          await commit("setCarrier", carrier);
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
          const carrier = data.data;
          await commit("updateCarriers", carrier);
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
          const carrier = data.data;
          await commit("updateCarriers", carrier);
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
    await customRequest("DELETE", "carriers", payload)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const carriers = data.data;
          await commit("deleteCarriers", carriers);
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
