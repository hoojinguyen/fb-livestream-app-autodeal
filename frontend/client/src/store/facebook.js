import _ from "lodash";
import { request } from "@/helpers/request";
import { getJSONStorageReader } from "@/helpers/local-storage.js";
import { handleError } from "@/helpers/handle-error";

const pageOwnerLocal = getJSONStorageReader("pageOwner");

const state = () => ({
  pages: [],
  pageOwners: [],
  listConversations: [],
  conversation: null,
  profile: null,
  loadingPage: false,
  loadingListConversations: false,
  loadingConversation: false,
  hasNewMessage: false,
});

const getters = {
  messages: (state) => state.conversationMessages.messages || [],
  userChat: (state) => state.conversationMessages.user || "",
};

const mutations = {
  setLoadingPage(state, payload) {
    state.loadingPage = payload;
  },

  setLoadingListConversations(state, payload) {
    state.loadingListConversations = payload;
  },

  setLoadingConversation(state, payload) {
    state.loadingConversation = payload;
  },

  setProfile(state, payload) {
    state.profile = payload;
  },

  setPages(state, payload) {
    // Set Pages
    state.pages = payload;

    // Set Pages Owners
    const owners = payload.map((el) => el.id);
    state.pageOwners = owners;
    pageOwnerLocal.set(owners);
  },

  setListConversations(state, payload) {
    state.listConversations = payload;
  },

  async setConversation(state, payload) {
    if (!payload) {
      state.conversation = null;
      return;
    }

    const { conversationId, messages } = payload;
    const owners = pageOwnerLocal.get();
    const dataCopy = _.cloneDeep(messages);
    let user = "";
    let formatMessages = dataCopy;

    formatMessages = formatMessages.map((el) => {
      const checkOwner = owners.includes(el.sender.id);
      if (!user) {
        user = checkOwner ? "" : el.sender.name;
      }
      return { ...el, isOwner: checkOwner };
    });

    state.conversation = {
      user,
      id: conversationId,
      messages: formatMessages,
    };
  },

  async updateMessage(state, message) {
    const checkExits = state.conversation.messages.find(
      (el) => el.id == message.id
    );
    if (!checkExits) {
      const owners = pageOwnerLocal.get();
      const isOwner = owners.includes(message.sender.id);
      const temp = {
        ...message,
        isOwner,
      };

      state.hasNewMessage = !isOwner;
      state.conversation.messages.push(temp);
    }
  },

  setHasNewMessage(state, payload) {
    state.hasNewMessage = payload;
  },
};

const actions = {
  async getPages({ commit }, payload) {
    const url = `/facebook/pages?facebookUserId=${payload.userId}&accessToken=${payload.accessToken}`;
    await commit("setLoadingPage", true);
    await request
      .get(url)
      .then(async ({ data }) => {
        const pages = data.data;
        const status = data.status;
        if (status) {
          await commit("setPages", pages);
          await commit("setLoadingPage", false);
        }
      })
      .catch((error) => {
        commit("setLoadingPage", false);
        handleError(error);
      });
  },

  async getConversations({ commit }, { pageId, accessToken }) {
    const url = `/facebook/conversations?pageId=${pageId}&accessToken=${accessToken}`;
    await commit("setLoadingListConversations", true);
    await request
      .get(url)
      .then(async ({ data }) => {
        const conversations = data.data;
        const status = data.status;
        if (status) {
          await commit("setListConversations", conversations);
          await commit("setLoadingListConversations", false);
        }
      })
      .catch((error) => {
        commit("setLoadingListConversations", false);
        handleError(error);
      });
  },

  async getMessages({ commit }, { conversationId, accessToken }) {
    // const url = `/facebook/messages?accessToken=${accessToken}&conversationId=${conversationId}`; //Get all message
    const url = `/facebook/messages?accessToken=${accessToken}&conversationId=${conversationId}&limit=50`; // Get message limit
    await commit("setLoadingConversation", true);
    await request
      .get(url)
      .then(async ({ data }) => {
        const messages = data.data;
        const status = data.status;
        if (status) {
          await commit("setConversation", { messages, conversationId });
          await commit("setLoadingConversation", false);
        }
      })
      .catch((error) => {
        commit("setLoadingConversation", false);
        handleError(error);
      });
  },

  async getMessage({ commit }, { conversationId, accessToken, limit }) {
    const url = `/facebook/messages?accessToken=${accessToken}&conversationId=${conversationId}&limit=${limit}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        const message = data.data[0];
        const status = data.status;
        if (status) {
          await commit("updateMessage", message);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  },

  // eslint-disable-next-line
  async sendMessage({ commit }, payload) {
    const url = `/facebook/messages/send`;
    let message = [];
    await request
      .post(url, payload)
      .then(({ data }) => {
        const status = data.status;
        if (status) {
          message = data.data;
        }
      })
      .catch((error) => {
        handleError(error);
      });

    return message;
  },

  async getProfile({ commit }, payload) {
    if (!payload) return;
    const url = `/facebook/profile?facebookUserId=${payload.userId}&accessToken=${payload.accessToken}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const profile = data.data;
          await commit("setProfile", profile);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  },

  /* eslint-disable */
  async getAccessTokenLongLive({ commit }, payload) {
    let res = null;
    const url = `/facebook/token?accessToken=${payload.accessToken}`;
    await request
      .get(url)
      .then(async ({ data }) => {
        res = data;
      })
      .catch((error) => {
        res = handleError(error);
      });
    return res;
  },

  /* eslint-disable */
  async ShareProductToWall({ commit }, payload) {
    let res = null;
    const url = `/facebook/share`;
    await request
      .post(url, payload)
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
