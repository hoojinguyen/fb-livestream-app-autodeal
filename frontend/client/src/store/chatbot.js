import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/chatbot";

const state = () => ({
  chatbots: [
    {
      id: 1,
      name: "Toi la chat bot 1",
      isActive: true,
    },
    {
      id: 2,
      name: "Toi la chat bot 2",
      isActive: false,
    },
  ],
});

const getters = {};

const mutations = {
  setChatbot(state, payload) {
    state.chatbots = payload;
  },
  updateStatusChatbot(state, payload) {
    state.chatbots.map((el) => {
      if (el.id == payload.id) {
        el.isActive = !el.isActive;
      }
      return;
    });
  },
};

const actions = {
  async fetchAll({ commit }) {
    let res = null;
    await request
      .get(baseURL)
      .then(async ({ data }) => {
        res = data;
        const status = data.status;
        if (status) {
          await commit("setChatbot", data.data);
        }
      })
      .catch((error) => {
        res = handleError(error);
      });

    return res;
  },

  /* eslint-disable */
  async create({ commit }, payload) {
    let res = null;
    await request
      .post(baseURL, payload)
      .then(async ({ data }) => {
        res = data;
      })
      .catch((error) => {
        res = handleError(error);
      });
    return res;
  },

  /* eslint-disable */
  async update({ commit }, payload) {
    commit("updateStatusChatbot", payload);
    let res = null;
    await request
      .put(baseURL, payload)
      .then(async ({ data }) => {
        res = data;
      })
      .catch((error) => {
        res = handleError(error);
      });
    return res;
  },

  /* eslint-disable */
  async delete({ commit }, payload) {
    let res = null;
    await customRequest("DELETE", "chatbot", payload)
      .then(async ({ data }) => {
        res = data;
      })
      .catch((error) => {
        res = handleError(error);
      });
    return res;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
