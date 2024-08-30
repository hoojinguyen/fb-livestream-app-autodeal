import { request, customRequest } from "@/helpers/request";
import { handleError } from "@/helpers/handle-error";
const baseURL = "/coupons";

const state = () => ({
  coupons: [],
  coupon: null,
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
  setCoupons(state, payload) {
    state.coupons = payload;
  },
  setCoupon(state, payload) {
    state.coupon = payload;
  },
  setStatus(state, { status, type }) {
    state.status[type] = status;
  },
  updateCoupons(state, payload) {
    const checkExists = state.coupons.find((el) => el.id == payload.id);
    if (checkExists) {
      state.coupons = state.coupons.filter((el) => el.id !== payload.id);
    }

    state.coupons.push(payload);
  },
  deleteCoupons(state, payload) {
    state.coupons = state.coupons.filter((coupon) => {
      return !payload.find((el) => el == coupon.id);
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
        const coupons = data.data;
        if (status) {
          await commit("setCoupons", coupons);
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
        const coupon = data.data;
        if (status) {
          await commit("setCoupon", coupon);
        }
        await commit("setLoading", false);
      })
      .catch((error) => {
        commit("setLoading", false);
        handleError(error);
      });
  },

  async create({ commit }, payload) {
    let res = null;
    await commit("setLoadingButton", true);
    await request
      .post(baseURL, payload)
      .then(async ({ data }) => {
        res = data;
        const status = data.status;
        if (status) {
          const coupon = data.data;
          await commit("updateCoupons", coupon);
          await commit("setCoupon", coupon);
        }
        await commit("setStatus", { status, type: "create" });
        await commit("setLoadingButton", false);
      })
      .catch((error) => {
        commit("setStatus", { status: false, type: "create" });
        commit("setLoadingButton", false);
        res = handleError(error);
      });
    return res;
  },

  async update({ commit }, payload) {
    await commit("setLoadingButton", true);
    await request
      .put(baseURL, payload)
      .then(async ({ data }) => {
        const status = data.status;
        const coupon = data.data;
        if (status) {
          await commit("updateCoupons", coupon);
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
    await customRequest("DELETE", "coupons", payload)
      .then(async ({ data }) => {
        const status = data.status;
        const coupons = data.data;
        if (status) {
          await commit("deleteCoupons", coupons);
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
