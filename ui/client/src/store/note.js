import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/notes";

const state = () => ({
  notes: [],
  note: null,
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
  setNotes(state, payload) {
    state.notes = payload;
  },
  setNote(state, payload) {
    state.note = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateNotes(state, payload) {
    const checkExists = state.notes.find((el) => el.id == payload.id);
    if (checkExists) {
      state.notes = state.notes.filter((el) => el.id !== payload.id);
    }

    state.notes.push(payload);
  },
  deleteNotes(state, payload) {
    state.notes = state.notes.filter((note) => {
      return !payload.find((el) => el == note.id);
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
        const notes = data.data;
        if (status) {
          await commit("setNotes", notes);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async fetchAllByCustomerId({ commit }, { customerId }) {
    await commit("setLoading", true);
    await request
      .get(`${baseURL}/customer/${customerId}`)
      .then(async ({ data }) => {
        const status = data.status;
        const notes = data.data;
        if (status) {
          await commit("setNotes", notes);
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
        const note = data.data;
        if (status) {
          await commit("updateNotes", note);
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
        const note = data.data;
        if (status) {
          await commit("updateNotes", note);
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
    await customRequest("DELETE", "notes", payload)
      .then(async ({ data }) => {
        const status = data.status;
        const notes = data.data;
        if (status) {
          await commit("deleteNotes", notes);
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
