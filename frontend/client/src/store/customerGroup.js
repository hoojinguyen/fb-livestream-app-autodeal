import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/customer/groups";

const state = () => ({
  customerGroups: [],
  customerGroup: null,
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
  setCustomerGroups(state, payload) {
    state.customerGroups = payload;
  },
  setCustomerGroup(state, payload) {
    state.customerGroup = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateCustomerGroups(state, payload) {
    const checkExists = state.customerGroups.find((el) => el.id == payload.id);
    if (checkExists) {
      state.customerGroups = state.customerGroups.filter(
        (el) => el.id !== payload.id
      );
    }

    state.customerGroups.push(payload);
  },
  deleteCustomerGroups(state, payload) {
    state.customerGroups = state.customerGroups.filter((customerGroup) => {
      return !payload.find((el) => el == customerGroup.id);
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
        const customerGroups = data.data;
        if (status) {
          await commit("setCustomerGroups", customerGroups);
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
        const customerGroup = data.data;
        if (status) {
          await commit("setCustomerGroup", customerGroup);
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
        const customerGroup = data.data;
        if (status) {
          await commit("updateCustomerGroups", customerGroup);
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
        const customerGroup = data.data;
        if (status) {
          await commit("updateCustomerGroups", customerGroup);
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
    await customRequest("DELETE", "customerGroups", payload)
      .then(async ({ data }) => {
        const status = data.status;
        const customerGroups = data.data;
        if (status) {
          await commit("deleteCustomerGroups", customerGroups);
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
