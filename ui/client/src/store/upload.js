// import { handleError } from "@/helpers/handle-error";
import { request } from "@/helpers/request";
import axios from "axios";
const baseURL = "/upload";

const actions = {
  // eslint-disable-next-line
  async uploadMultipleFile({ commit }, { filesAttach, folder = "" }) {
    let images = [];

    try {
      const result = await request.post(`${baseURL}/multiple`, {
        fileNames: filesAttach.map((fi) => fi.name.replace(/\s+/g, "")),
        folder,
      });

      const { data, status } = result.data;

      if (status && data.length) {
        images = await Promise.all(
          data.map(async (el, index) => {
            await axios.put(el.signedRequest, filesAttach[index]);
            return el.urlImage;
          })
        );
      }
      return images;
    } catch (error) {
      return images;
    }
  },

  // eslint-disable-next-line
  async uploadSingleFile({ commit }, { fileAttach, folder = "" }) {
    let image = null;
    try {
      const result = await request.post(`${baseURL}/single`, {
        fileName: fileAttach.name.replace(/\s+/g, ""),
        folder,
      });
      const { data, status } = result.data;
      if (status) {
        image = data.urlImage;
        await axios.put(data.signedRequest, fileAttach);
      }
      return image;
    } catch (error) {
      return image;
    }
  },
};

export default {
  namespaced: true,
  actions,
};
