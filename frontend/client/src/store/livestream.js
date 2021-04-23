import { request } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";

const state = () => ({
  listLivestream: [],
  livestreamDetails: null,
  syntax: [],
  productGroup: {
    name: "",
    products: [],
  },
  orders: [],
  commentCurrent: null,
  logs: [],
});

const getters = {
  isStatusVOD: (state) =>
    state.livestreamDetails && state.livestreamDetails.status == "VOD",
  totalComment: (state) =>
    (state.livestreamDetails && state.livestreamDetails.comments.length) || 0,
  totalReaction: (state) =>
    (state.livestreamDetails && state.livestreamDetails.reactions.length) || 0,
  totalViewer: (state) =>
    (state.livestreamDetails && state.livestreamDetails.liveViewer) || 0,
  livestreamStatus: (state) => state.livestreamDetails.status || "VOD",
  comments: (state) =>
    (state.livestreamDetails && state.livestreamDetails.comments) || [],
  totalOrder: (state) => (state.orders && state.orders.length) || 0,
  totalCustomer: (state) => (state.orders && state.orders.length) || 0,
  totalProductAvailable: (state) =>
    state.productGroup.products.filter((el) => el.stock).length || 0,
};

const mutations = {
  setLivestreamDetails(state, payload) {
    state.livestreamDetails = payload;
  },

  setListLivestream(state, payload) {
    state.listLivestream = payload;
  },

  setProductGroup(state, payload) {
    state.productGroup = payload;
  },

  setSyntax(state, payload) {
    state.syntax = payload;
  },

  setOrders(state, payload) {
    state.orders = payload;
  },

  updateComment(state, comments) {
    if (comments.length) {
      const comment = comments[0];

      const checkExits = state.livestreamDetails.comments.find(
        (el) => el.id == comment.id
      );

      if (!checkExits) {
        state.livestreamDetails.comments.push(comment);
        state.commentCurrent = comment;
      } else {
        state.commentCurrent = null;
      }
    }
  },

  updateLogs(state, payload) {
    state.logs.push(payload);
  },
};

const actions = {
  async getComments({ commit }, { livestreamId, accessToken, limit }) {
    const url = `/facebook/livestream/comments/${livestreamId}?limit=${limit}&accessToken=${accessToken}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        const status = data.status;
        const comments = data.data;
        if (status) {
          commit("updateComment", comments);
        }
      })
      .catch((error) => {
        let page = "livestream";
        handleError(error, page);
      });
  },

  async getListLivestream({ commit }, { pageId, accessToken }) {
    const url = `/facebook/livestream?pageId=${pageId}&accessToken=${accessToken}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        const listLivestream = data.data;
        const status = data.status;
        if (status) {
          await commit("setListLivestream", listLivestream);
        }
      })
      .catch((error) => {
        let page = "livestream";
        handleError(error, page);
      });
  },

  async getLivestreamDetails({ commit }, { livestreamId, accessToken }) {
    const url = `/facebook/livestream/detail/${livestreamId}?accessToken=${accessToken}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        const livestreamDetails = data.data;
        const status = data.status;
        if (status) {
          await commit("setLivestreamDetails", livestreamDetails);
        }
      })
      .catch((error) => {
        let page = "livestream";
        handleError(error, page);
      });
  },

  async getProductGroup({ commit }, { id }) {
    const url = `/product/groups/${id}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const productGroup = data.data;
          await commit("setProductGroup", productGroup);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  },

  async getSyntax({ commit }, { id }) {
    const url = `/syntaxes/${id}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const syntax = data.data.details;
          await commit("setSyntax", syntax);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  },

  async getOrders({ commit }, { id }) {
    const url = `/orders/livestream/${id}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const orders = data.data;
          await commit("setOrders", orders);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  },

  // eslint-disable-next-line
  async createLivestream({ commit }, payload) {
    const url = "/livestreams";
    let res = null;
    await request
      .post(url, payload)
      .then(({ data }) => {
        res = data;
      })
      .catch((error) => {
        res = handleError(error);
      });
    return res;
  },

  // eslint-disable-next-line
  async fetchLivestreamByFbLiveId({ commit }, { id }) {
    const url = "/livestreams/facebook";
    let res = null;
    await request
      .get(`${url}/${id}`)
      .then(({ data }) => {
        res = data;
      })
      .catch((error) => {
        res = handleError(error);
      });

    return res;
  },

  async addLogs({ commit }, payload) {
    commit("updateLogs", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
