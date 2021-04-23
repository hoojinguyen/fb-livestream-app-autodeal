import Cookies from "js-cookie";

const TokenKey = "access-token";

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
