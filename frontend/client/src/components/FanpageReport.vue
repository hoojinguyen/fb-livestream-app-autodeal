<template>
  <div class="fanpage-report">
    <div class="fanpage-report__header">
      <p class="fp-title">Báo cáo thống kê tương tác Fanpage</p>
      <FilterReport
        isReportBy="fanpage"
        @getDataReport="getDataReport"
        @changeOptionDisplay="changeOptionDisplay"
      />
    </div>
    <hr />
    <div class="fanpage-report__body">
      <template v-if="!isGetData">
        <p class="rp-no-data">Chưa có dữ liệu ...</p>
      </template>
      <template v-else>
        <div class="fp-chart">
          <div class="fp-chart__header">
            <p class="title">Thống kê tương tác Fanpage</p>
            <p class="sub-title">Từ {{ dateFrom }} đến {{ dateTo }}</p>
          </div>
          <div class="fp-chart__body">
            <template v-if="optionDisplay == 'chart'">
              <div class="data-chart">
                <Chart
                  type="bar"
                  :data="stackedData"
                  :options="stackedOptions"
                />
              </div>
            </template>
            <template v-else>
              <div class="data-table">
                <DataTable
                  :value="dataTableReport"
                  :scrollable="true"
                  :loading="isLoading"
                  scrollHeight="450px"
                  class="p-datatable-gridlines"
                >
                  <Column
                    headerStyle="background-color: #DAE3FC"
                    bodyStyle="background-color: #F4F7FE"
                    field="date"
                    header="Ngày"
                  ></Column>
                  <Column
                    headerStyle="background-color: #DAE3FC"
                    bodyStyle="background-color: #F4F7FE"
                    field="totalCustomer"
                    header="SL Khách hàng"
                  ></Column>
                  <Column
                    headerStyle="background-color: #DAE3FC"
                    bodyStyle="background-color: #F4F7FE"
                    field="totalInteractive"
                    header="SL Tương tác"
                  >
                  </Column>
                  <Column
                    headerStyle="background-color: #DAE3FC"
                    bodyStyle="background-color: #F4F7FE"
                    field="totalFeedBack"
                    header="SL Phản hồi từ nhân viên"
                  >
                  </Column>
                  <template #empty>
                    <div style="text-align: center">
                      <p class="p-mt-2">Chưa có dữ liệu ...</p>
                    </div>
                  </template>
                </DataTable>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/Chart";
import FilterReport from "@/components/FilterReport";

export default {
  components: { Chart, FilterReport },
  data() {
    return {
      isGetData: false,
      isLoading: false,
      optionDisplay: "chart",
      dateFrom: "20/10/2020",
      dateTo: "28/10/2020",
      dataTableReport: [
        {
          id: 1,
          date: "20/10/2020",
          totalCustomer: 10,
          totalInteractive: 12,
          totalFeedBack: 32,
        },
        {
          id: 2,
          date: "21/10/2020",
          totalCustomer: 12,
          totalInteractive: 2,
          totalFeedBack: 4,
        },
        {
          id: 3,
          date: "22/10/2020",
          totalCustomer: 2,
          totalInteractive: 0,
          totalFeedBack: 10,
        },
        {
          id: 4,
          date: "23/10/2020",
          totalCustomer: 1,
          totalInteractive: 2,
          totalFeedBack: 5,
        },
        {
          id: 5,
          date: "24/10/2020",
          totalCustomer: 0,
          totalInteractive: 0,
          totalFeedBack: 0,
        },
        {
          id: 6,
          date: "25/10/2020",
          totalCustomer: 0,
          totalInteractive: 2,
          totalFeedBack: 30,
        },
        {
          id: 7,
          date: "26/10/2020",
          totalCustomer: 0,
          totalInteractive: 32,
          totalFeedBack: 22,
        },
        {
          id: 8,
          date: "27/10/2020",
          totalCustomer: 20,
          totalInteractive: 2,
          totalFeedBack: 12,
        },
        {
          id: 9,
          date: "28/10/2020",
          totalCustomer: 15,
          totalInteractive: 1,
          totalFeedBack: 2,
        },
      ],
      stackedData: {
        labels: [
          "20/10/2020",
          "21/10/2020",
          "22/10/2020",
          "23/10/2020",
          "24/10/2020",
          "25/10/2020",
          "26/10/2020",
          "27/10/2020",
          "28/10/2020",
        ],
        datasets: [
          {
            type: "bar",
            label: "SL Tương tác",
            backgroundColor: "#66BB6A",
            data: [10, 12, 2, 1, 0, 0, 0, 20, 15],
          },
          {
            type: "bar",
            label: "SL Phản hồi",
            backgroundColor: "#42A5F5 ",
            data: [32, 4, 10, 5, 0, 30, 22, 12, 2],
          },
        ],
      },
      stackedOptions: {
        tooltips: {
          mode: "index",
          intersect: false,
        },
        responsive: true,
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      },
    };
  },

  methods: {
    changeOptionDisplay(value) {
      this.optionDisplay = value;
    },

    getDataReport(value) {
      this.isGetData = value;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/fanpage-report";
</style>
