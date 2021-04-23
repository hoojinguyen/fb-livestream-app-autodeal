import { request } from "@/helpers/request";
import { setToken } from "@/utils/auth";
import { handleError } from "@/helpers/handle-error";

const actions = {
  // eslint-disable-next-line
  async login({ commit }, payload) {
    const url = "/auth/local";
    let result = null;
    await request
      .post(url, payload)
      .then(async ({ data }) => {
        if (data.ok) {
          await setToken(data.access_token);
          result = { status: true };
        } else {
          result = { status: false, error: data.error };
        }
      })
      .catch((error) => {
        result = handleError(error);
      });
    return result;
  },

  // eslint-disable-next-line
  async signup({ commit }, payload) {
    const url = "/signup";
    let result = null;
    await request
      .post(url, payload)
      .then(async ({ data }) => {
        if (data.status) {
          // await setToken(data.access_token);
          result = { status: true };
        } else {
          result = { status: false, error: data.message };
        }
      })
      .catch((error) => {
        result = handleError(error);
      });
    return result;
  },
};

export default {
  namespaced: true,
  actions,
};
