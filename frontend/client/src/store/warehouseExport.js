import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/warehouse/export";

const instantsTest = [
  {
    id: 1,
    type: "user",
    name: "Nguyễn Văn Hội",
    title: "Chủ cửa hàng",
  },
  {
    id: 2,
    type: "carrier",
    name: "Giao hàng giá rẻ",
    title: "Giao hàng giá rẻ - Đối tác",
  },
  {
    id: 3,
    type: "carrier",
    name: "Giao hàng nhanh",
    title: "Giao hàng nhanh - Đối tác",
  },
];

const state = () => ({
  receipts: [],
  receipt: null,
  receiptDetails: null,
  instants: [],
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
  setReceipts(state, payload) {
    state.receipts = payload;
  },
  setReceipt(state, payload) {
    state.receipt = payload;
  },
  setReceiptDetails(state, { id, details }) {
    state.receipts = state.receipts.map((el) => {
      if (el.id == id) {
        el.details = details;
      }
      return el;
    });
    state.receiptDetails = details;
  },
  setInstants(state, payload) {
    state.instants = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateReceipts(state, payload) {
    const checkExists = state.receipts.find((el) => el.id == payload.id);
    if (checkExists) {
      state.receipts = state.receipts.filter((el) => el.id !== payload.id);
    }

    state.receipts.unshift(payload);
  },
  deleteReceipts(state, payload) {
    state.receipts = state.receipts.filter((receipt) => {
      return !payload.find((el) => el == receipt.id);
    });
  },
};

const actions = {
  async fetchInstants({ commit }) {
    commit("setInstants", instantsTest);
  },

  async fetchReceipts({ commit }) {
    await commit("setLoading", true);
    await request
      .get(baseURL)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const receipts = data.data;
          await commit("setReceipts", receipts);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async fetchReceiptById({ commit }, { id }) {
    await commit("setLoading", true);
    await request
      .get(`${baseURL}/${id}`)
      .then(async ({ data }) => {
        const status = data.status;
        const receipt = data.data;
        if (status) {
          await commit("setReceipt", receipt);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async createReceipt({ commit }, payload) {
    await commit("setLoadingButton", true);
    await request
      .post(baseURL, payload)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const receipt = data.data;
          await commit("setReceipt", receipt);
          await commit("updateReceipts", receipt);
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

  async updateReceipt({ commit }, payload) {
    await commit("setLoadingButton", true);
    await request
      .put(baseURL, payload)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const receipt = data.data;
          await commit("updateReceipts", receipt);
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

  async deleteReceipt({ commit }, payload) {
    await commit("setLoadingButton", true);
    await customRequest("DELETE", "warehouse/import", payload)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const receipts = data.data;
          await commit("deleteReceipts", receipts);
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

  async fetchDetails({ commit }, { id }) {
    await commit("setLoadingButton", true);
    await request
      .get(`${baseURL}/details/${id}`)
      .then(async ({ data }) => {
        const status = data.status;
        if (status) {
          const details = data.data;
          await commit("setReceiptDetails", { id, details });
        }
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setLoadingButton", false);
        handleError(error);
      });
  },
  async createDetails({ commit }, payload) {
    await request
      .post(`${baseURL}/details`, payload)
      .then(() => {
        commit("setStatus", { status, type: "create" });
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "create" });
        handleError(error);
      });
  },
  async updateDetails({ commit }, payload) {
    await request
      .put(`${baseURL}/details`, payload)
      .then(() => {
        commit("setStatus", { status, type: "update" });
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "update" });
        handleError(error);
      });
  },
  async deleteDetails({ commit }, payload) {
    await customRequest("DELETE", "warehouse/import/details", payload)
      .then(() => {
        commit("setStatus", { status, type: "delete" });
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "delete" });
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
