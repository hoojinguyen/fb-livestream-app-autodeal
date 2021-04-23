import { removeFacebookLocal } from "@/utils/auth";

const TOKEN_EXPIRES = ["validating access token", "Session has expired"];

const expireTokenFB = (err) => {
  let isExpire = false;
  TOKEN_EXPIRES.map((t) => {
    if (err.search(t) != -1) {
      isExpire = true;
      return;
    }
  });
  return isExpire;
};

// eslint-disable-next-line
export function handleError(error, page = null) {
  let err = JSON.stringify(error.response);
  err = JSON.parse(err);
  if (err.data) {
    let message = "";
    if (err.data.error && err.data.error.message) {
      message = err.data.error.message;
    }
    if (expireTokenFB(message)) {
      removeFacebookLocal();
    }

    // if (err.code && err.code == 190) {
    //   removeFacebookLocal();

    //   if (page == "livestream") {
    //     window.location.href = "/";
    //   }
    // }
    return err.data;
  }

  return { status: false, message: "Request Failed" };
}
