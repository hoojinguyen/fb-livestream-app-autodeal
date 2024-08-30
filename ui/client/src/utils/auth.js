import Cookies from "js-cookie";
import {
  getJSONStorageReader,
  getStorageReader,
} from "@/helpers/local-storage.js";

const pageConnectedLocal = getJSONStorageReader("pageConnected");
const accessTokenLocal = getStorageReader("accessToken");
const pageOwnerLocal = getJSONStorageReader("pageOwner");
const pageCurrentLocal = getJSONStorageReader("pageCurrent");

const TokenKey = "access-token";
const TokenFB = "fb-access-token";
const IdFB = "fb-user-id";
const TokenFBLongLive = "fb-access-token-long-live";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function setId(id) {
  return Cookies.set("userId", id);
}

export function getId() {
  return Cookies.get("userId");
}

export function getFBToken() {
  return Cookies.get(TokenFB);
}

export function getFBId() {
  return Cookies.get(IdFB);
}

export function removeAll() {
  Cookies.remove(IdFB);
  Cookies.remove(TokenFBLongLive);
  Cookies.remove(TokenFB);
  Cookies.remove(TokenKey);

  pageConnectedLocal.remove();
  pageOwnerLocal.remove();
  pageCurrentLocal.remove();
  accessTokenLocal.remove();
}

export function removeFacebookLocal() {
  pageConnectedLocal.remove();
  pageOwnerLocal.remove();
  pageCurrentLocal.remove();
}
