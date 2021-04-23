import { request } from "@/helpers/request";
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
          result = { status: true, data };
        } else {
          result = { status: false, error: data.error };
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
