import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/warehouse";

const state = () => ({
  warehouse: [],
  // receipts: [],
  receipts: receiptsTest,
  receipt: null,
  // inventories: [],
  inventories: inventoriesTest,
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
  setWareHouse(state, payload) {
    state.warehouse = payload;
  },
  setInventories(state, payload) {
    state.inventories = payload;
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

    state.receipts.push(payload);
  },
  deleteReceipts(state, payload) {
    state.receipts = state.receipts.filter((wa) => {
      return !payload.find((el) => el == wa.id);
    });
  },
};

const actions = {
  async fetchInstants({ commit }) {
    commit("setInstants", instantsTest);
  },

  async fetchInventories({ commit }) {
    await commit("setLoading", true);
    await request
      .get(baseURL)
      .then(async ({ data }) => {
        const status = data.status;
        const inventories = data.data;
        if (status) {
          await commit("setInventories", inventories);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async fetchReceipt({ commit }) {
    await commit("setLoading", true);
    await request
      .get(baseURL)
      .then(async ({ data }) => {
        const status = data.status;
        const receipts = data.data;
        if (status) {
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
        const receipt = data.data;
        if (status) {
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
        const receipt = data.data;
        if (status) {
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
    await customRequest("DELETE", "warehouse", payload)
      .then(async ({ data }) => {
        const status = data.status;
        const receipts = data.data;
        if (status) {
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
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

const variantsTest = [
  {
    id: Math.random(),
    sku: "ATCT-D-S-01",
    name: "Áo thun cổ tròn (Đỏ/S)",
    color: "Đỏ",
    size: "S",
    sellPrice: 200000,
    buyPrice: 250000,
    stock: 20,
    warehouse: "HK Team store",
    unit: {
      id: 1,
      name: "Chiếc",
    },
  },
  {
    id: Math.random(),
    sku: "ATCT-V-S-01",
    name: "Áo thun cổ tròn (Vàng/S)",
    color: "Vàng",
    size: "S",
    sellPrice: 200000,
    buyPrice: 250000,
    stock: 20,
    warehouse: "HK Team store",
    unit: {
      id: 1,
      name: "Chiếc",
    },
  },
];

const receiptsTest = [
  {
    id: Math.random(),
    numReceipt: "NK001",
    instant: {
      id: 1,
      type: "user",
      name: "Nguyễn Văn Hội",
      title: "Nguyễn Văn Hội - Chủ cửa hàng",
    },
    description: "Phiếu nhập hàng của giao hàng giá rẻ",
    createdAt: new Date(),
    variants: variantsTest,
  },
  {
    id: Math.random(),
    numReceipt: "NK002",
    instant: {
      id: 2,
      type: "carrier",
      name: "Giao hàng giá rẻ",
      title: "Giao hàng giá rẻ - Đối tác",
    },
    description: "Phiếu nhập kho của chủ cửa hàng",
    createdAt: new Date(),
    variants: variantsTest,
  },
  {
    id: Math.random(),
    numReceipt: "NK001",
    instant: {
      id: 3,
      type: "carrier",
      name: "Giao hàng nhanh",
      title: "Giao hàng nhanh - Đối tác",
    },
    description: "Phiếu nhập kho của giao hàng nhanh",
    createdAt: new Date(),
    variants: variantsTest,
  },
];

const inventoriesTest = [
  {
    id: Math.random(),
    sku: "AT01",
    name: "Ao Hoodie",
    unit: "Chiec",
    category: "Hang Cao Cap",
    warehouse: "HK Team Store",
    totalInventory: 20,
    totalImport: 100,
    totalExport: 0,
    totalOrder: 10,
  },
  {
    id: Math.random(),
    sku: "AT01",
    name: "Ao Hoodie",
    unit: "Chiec",
    category: "Hang Cao Cap",
    warehouse: "HK Team Store",
    totalInventory: 20,
    totalImport: 100,
    totalExport: 0,
    totalOrder: 10,
  },
  {
    id: Math.random(),
    sku: "AT01",
    name: "Ao Hoodie",
    unit: "Chiec",
    category: "Hang Cao Cap",
    warehouse: "HK Team Store",
    totalInventory: 20,
    totalImport: 100,
    totalExport: 0,
    totalOrder: 10,
  },
  {
    id: Math.random(),
    sku: "AT01",
    name: "Ao Hoodie",
    unit: "Chiec",
    category: "Hang Cao Cap",
    warehouse: "HK Team Store",
    totalInventory: 20,
    totalImport: 100,
    totalExport: 0,
    totalOrder: 10,
  },
];

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
