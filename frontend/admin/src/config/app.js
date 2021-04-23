const apiURL = process.env.VUE_APP_BASE_API || "http://kltn.liveapp.local";
const baseURL = process.env.VUE_APP_BASE_URL || "";
const fbAppId = process.env.VUE_APP_FACEBOOK_APP_ID || "369693187537982";

module.exports = {
  baseURL,
  apiURL,
  fbAppId,
};
