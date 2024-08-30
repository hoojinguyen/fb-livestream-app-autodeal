// import axios from "axios";

const state = () => ({
  messages: [],
  messageInfo: {},
});

const getters = {};

const mutations = {
  setMessages(state, payload) {
    state.messages = payload;
  },
  setActiveMessage(state, { id }) {
    state.messages.map((el) => {
      if (el.isActive) {
        el.isActive = false;
        return el;
      }
      if (el.id === id) {
        el.isActive = true;
        return el;
      }
    });
  },

  setMessageInfo(state, payload) {
    state.messageInfo = payload;
  },

  addMessageToConversation(state, payload) {
    state.messageInfo.conversations.push(payload);
  },

  addNewNote(state, content) {
    const { notes } = state.messageInfo;
    state.messageInfo.notes.push({ id: notes.length + 1, content });
  },

  removeNote(state, payload) {
    const { notes } = state.messageInfo;
    state.messageInfo.notes = notes.filter((el) => el.id != payload.id);
  },
};

const actions = {
  // async getMessageBySource({ commit }, { source }) {
  //   const res = await axios.get("/assets/demo/data/sale/messages.json");
  //   let { messages } = res.data;
  //   if (messages) {
  //     messages = messages.find((el) => el.source === source);
  //     let { list } = messages;
  //     if (list.length) {
  //       list = messages.list.map((el) => {
  //         return { ...el, isActive: false };
  //       });
  //     }
  //     commit("setMessages", list);
  //   }
  // },
  // async getInfoMessageByUserId({ commit }, { id }) {
  //   const res = await axios.get("/assets/demo/data/sale/message.json");
  //   const message = res.data.message.find((el) => el.id == id);
  //   commit("setMessageInfo", message);
  // },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
