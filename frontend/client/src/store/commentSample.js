import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/comments";

const state = () => ({
  commentSamples: [],
  commentSample: null,
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
  setCommentSamples(state, payload) {
    state.commentSamples = payload;
  },
  setCommentSample(state, payload) {
    state.commentSample = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateCommentSamples(state, payload) {
    const checkExists = state.commentSamples.find((el) => el.id == payload.id);
    if (checkExists) {
      state.commentSamples = state.commentSamples.filter(
        (el) => el.id !== payload.id
      );
    }

    state.commentSamples.push(payload);
  },
  deleteCommentSamples(state, payload) {
    state.commentSamples = state.commentSamples.filter((commentSample) => {
      return !payload.find((el) => el == commentSample.id);
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
        const commentSamples = data.data;
        if (status) {
          await commit("setCommentSamples", commentSamples);
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
        const commentSample = data.data;
        if (status) {
          await commit("setCommentSample", commentSample);
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
        const commentSample = data.data;
        if (status) {
          await commit("updateCommentSamples", commentSample);
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
        const commentSample = data.data;
        if (status) {
          await commit("updateCommentSamples", commentSample);
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
    await customRequest("DELETE", "comments", payload)
      .then(async ({ data }) => {
        const status = data.status;
        const commentSamples = data.data;
        if (status) {
          await commit("deleteCommentSamples", commentSamples);
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
