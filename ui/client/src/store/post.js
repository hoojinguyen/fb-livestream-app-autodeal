import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";

const state = () => ({
  posts: [],
  post: null,
});

const getters = {};

const mutations = {
  setListPost(state, payload) {
    state.posts = payload;
  },

  setPostDetails(state, payload) {
    state.livestream = payload;
  },
};

const actions = {
  async getPublishPosts({ commit }, { pageId, accessToken }) {
    const url = `/facebook/posts/publish?pageId=${pageId}&accessToken=${accessToken}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        const posts = data.data;
        const status = data.status;
        if (status) {
          await commit("setListPost", posts);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  },

  async getScheduledPosts({ commit }, { pageId, accessToken }) {
    const url = `/facebook/posts/scheduled?pageId=${pageId}&accessToken=${accessToken}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        const posts = data.data;
        const status = data.status;
        if (status) {
          await commit("setListPost", posts);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  },

  async getPost({ commit }, { pagePostId, accessToken }) {
    const url = `/facebook/post?pagePostId=${pagePostId}&accessToken=${accessToken}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        const post = data.data;
        const status = data.status;
        if (status) {
          await commit("setPostDetails", post);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  },

  // eslint-disable-next-line
  async publishPost({ commit }, payload) {
    const url = `/facebook/post/publish`;
    let post = null;
    await request
      .post(url, payload)
      .then(({ data }) => {
        const status = data.status;
        if (status) {
          post = data.data;
        }
      })
      .catch((error) => {
        handleError(error);
      });

    return post;
  },

  // eslint-disable-next-line
  async replyAllComments({ commit }, payload) {
    const url = `/facebook/post/comment/reply`;
    let reply = null;
    await request
      .post(url, payload)
      .then(({ data }) => {
        const status = data.status;
        if (status) {
          reply = data.data;
        }
      })
      .catch((error) => {
        handleError(error);
      });

    return reply;
  },

  // eslint-disable-next-line
  async createPostFeed({ commit }, payload) {
    const url = `/facebook/post/feed`;
    let post = null;
    await request
      .post(url, payload)
      .then(({ data }) => {
        const status = data.status;
        if (status) {
          post = data.data;
        }
      })
      .catch((error) => {
        handleError(error);
      });
    return post;
  },

  // eslint-disable-next-line
  async createPostPhoto({ commit }, payload) {
    const url = `/facebook/post/photo`;
    let post = null;
    await request
      .post(url, payload)
      .then(({ data }) => {
        const status = data.status;
        if (status) {
          post = data.data;
        }
      })
      .catch((error) => {
        handleError(error);
      });
    return post;
  },

  // eslint-disable-next-line
  async updatePost({ commit }, payload) {
    const url = `/facebook/post`;
    let post = null;
    await request
      .put(url, payload)
      .then(({ data }) => {
        const status = data.status;
        if (status) {
          post = data.data;
        }
      })
      .catch((error) => {
        handleError(error);
      });
    return post;
  },

  // eslint-disable-next-line
  async deletePost({ commit }, payload) {
    try {
      await customRequest("DELETE", "facebook/post", payload);
    } catch (error) {
      handleError(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
