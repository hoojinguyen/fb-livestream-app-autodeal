import _ from "lodash";
import moment from "moment";

// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from "@/utils";

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + "s";
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), " minute");
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), " hour");
  } else {
    return pluralize(~~(between / 86400), " day");
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
      );
    }
  }
  return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 10000 => $10,000
 * @param {number} num
 */
export function formatMoney(num) {
  return new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  }).format(num);
}

/**
 * JSON
 */
export function formatJSON(json) {
  return JSON.stringify(_.pickBy(json, (value, key) => !key.startsWith("_")));
}

/**
 * Date
 */
export function formatDateAndTime(value) {
  return moment(value).format("DD/MM/YYYY hh:mm");
}

export function formatDate(value) {
  return moment(value).format("DD/MM/YYYY");
}

/**
 * RoundedPercentage
 */
export function roundedPercentage(value) {
  return Math.round(value * 100);
}

export function getAvatarFB(id) {
  return `//graph.facebook.com/${id}/picture`;
}

export function getAvatarFbWithToken(id, token) {
  return `//graph.facebook.com/${id}/picture?access_token=${token}`;
}

export function formatSizeIFrame(data) {
  // eslint-disable-next-line
  return data.replaceAll("\\", "").match(/src=\"([^\s]+?)\"\s/)[1];
}

export function formatUnixDate(value) {
  return moment(value).unix();
}

export function formatStatus(value) {
  const statusName = {
    1: "Đã tạo đơn",
    2: "Đã chốt đơn",
    3: "Đã Xác nhận TT GH",
    4: "Chuẩn bị giao hàng",
    5: "Đang giao hàng",
    6: "Đã giao hàng",
    7: "Trả hàng",
    0: "Đơn bị huỷ",
  };
  return statusName[value];
}
