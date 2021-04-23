export const reportBy = [
  { name: "Ngày", value: "day" },
  { name: "Tuần", value: "week" },
  { name: "Tháng", value: "month" },
  { name: "Quý", value: "quarter" },
  { name: "Năm", value: "year" },
];

export const reportType = [
  { name: "Hôm nay", value: "currentDay" },
  { name: "Hôm qua", value: "lastDay" },
  { name: "Tuần này", value: "currentWeek" },
  { name: "Tuần trước", value: "lastWeek" },
  { name: "Tháng này", value: "currentMonth" },
  { name: "Tháng trước", value: "lastMonth" },
  { name: "Khác", value: "another" },
];

export const optionsReport = [
  { icon: "pi pi-chart-line", value: "chart" },
  { icon: "pi pi-table", value: "table" },
];

export default { reportBy, reportType, optionsReport };
