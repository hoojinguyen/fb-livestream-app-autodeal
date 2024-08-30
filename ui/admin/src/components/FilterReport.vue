<template>
  <div class="report-filter">
    <div class="report-filter__item">
      <label>Thống kê theo</label>
      <Dropdown
        v-model="selectedReportBy"
        :options="reportBy"
        optionLabel="name"
        placeholder="Ngày"
        class="cus-dropdown"
        scrollHeight="400px"
      />
    </div>
    <div class="report-filter__item">
      <label>Kỳ báo cáo</label>
      <Dropdown
        v-model="selectedReportType"
        :options="reportType"
        optionLabel="name"
        placeholder="Hôm nay"
        class="cus-dropdown"
        scrollHeight="400px"
      />
    </div>
    <div class="report-filter__item">
      <label>Khoảng thời gian</label>
      <Calendar
        v-model="date"
        selectionMode="range"
        :manualInput="false"
        dateFormat="dd/mm/yy"
        class="cus-dropdown"
        :disabled="selectedReportType.value != 'another'"
      />
    </div>
    <div class="report-filter__item">
      <label>Hiển thị theo</label>
      <SelectButton
        v-model="optioned"
        :options="optionsReport"
        dataKey="value"
        class="cus-sebutton"
      >
        <template #option="slotProps">
          <i :class="slotProps.option.icon"></i>
        </template>
      </SelectButton>
    </div>
    <div class="report-filter__item">
      <Button
        label="Lấy dữ liệu"
        class="p-button-outlined cus-button"
        @click="getDataReport"
      />
    </div>
  </div>
</template>

<script>
import { reportBy, reportType, optionsReport } from "@/constants/report";

export default {
  props: {
    isReportBy: { type: String, default: "order" },
  },

  data() {
    return {
      selectedReportBy: reportBy[0],
      reportBy: reportBy,
      selectedReportType: reportType[0],
      reportType: reportType,
      date: null,
      optionsReport: optionsReport,
      optioned: optionsReport[0],
    };
  },

  created() {
    let today = new Date();
    this.date = [today, null];
  },

  watch: {
    optioned(op) {
      if (op) {
        this.$emit("changeOptionDisplay", op.value);
      }
    },
  },

  methods: {
    getDataReport() {
      let data = {
        reportBy: this.selectedReportBy.value,
        reportType: this.selectedReportType.value,
        from: this.date[0],
        to: this.date[1],
      };
      this.$emit("getDataReport", { reportBy: this.isReportBy, data });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./public/assets/sass/custom/components/filter-report";
</style>
