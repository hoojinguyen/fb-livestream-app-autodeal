import axios from "axios";
import config from "@/config";
import { getToken } from "@/utils/auth"; // get token from cookie

export const request = axios.create({
  baseURL: config.app.apiURL,
  headers: {
    authorization: `Bearer ${getToken()}`,
  },
});

export const customRequest = (method, query, data) =>
  axios({
    method,
    url: `${config.app.apiURL}/${query}`,
    data,
    headers: { authorization: `Bearer ${getToken()}` },
  });
