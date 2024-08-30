import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/messages";

const state = () => ({
  messageSamples: [],
  messageSample: null,
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
  setMessageSamples(state, payload) {
    state.messageSamples = payload;
  },
  setMessageSample(state, payload) {
    state.messageSample = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateMessageSamples(state, payload) {
    const checkExists = state.messageSamples.find((el) => el.id == payload.id);
    if (checkExists) {
      state.messageSamples = state.messageSamples.filter(
        (el) => el.id !== payload.id
      );
    }

    state.messageSamples.push(payload);
  },
  deleteMessageSamples(state, payload) {
    state.messageSamples = state.messageSamples.filter((messageSample) => {
      return !payload.find((el) => el == messageSample.id);
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
        const messageSamples = data.data;
        if (status) {
          await commit("setMessageSamples", messageSamples);
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
        const messageSample = data.data;
        if (status) {
          await commit("setMessageSample", messageSample);
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
        const messageSample = data.data;
        if (status) {
          await commit("updateMessageSamples", messageSample);
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
        const messageSample = data.data;
        if (status) {
          await commit("updateMessageSamples", messageSample);
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
    await customRequest("DELETE", "messages", payload)
      .then(async ({ data }) => {
        const status = data.status;
        const messageSamples = data.data;
        if (status) {
          await commit("deleteMessageSamples", messageSamples);
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
