<template>
  <div class="customer-report">
    <div class="customer-report__header">
      <p class="cus-title">
        Báo cáo số lượng khách hàng gửi tin nhắn, bình luận
      </p>
      <FilterReport
        isReportBy="customer"
        @getDataReport="getDataReport"
        @changeOptionDisplay="changeOptionDisplay"
      />
    </div>
    <hr />
    <div class="customer-report__body">
      <template v-if="!isGetData">
        <p class="rp-no-data">Chưa có dữ liệu ...</p>
      </template>
      <template v-else>
        <div class="cus-chart">
          <div class="cus-chart__header">
            <p class="title">Số lượng khách hàng gửi tin nhắn bình luận</p>
            <p class="sub-title">Từ {{ dateFrom }} đến {{ dateTo }}</p>
          </div>
          <div class="cus-chart__body">
            <template v-if="optionDisplay == 'chart'">
              <div class="data-chart">
                <Chart
                  type="line"
                  :data="multiAxisData"
                  :options="multiAxisOptions"
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
                    field="totalMessage"
                    header="SL KH gửi tin nhắn"
                  ></Column>
                  <Column
                    headerStyle="background-color: #DAE3FC"
                    bodyStyle="background-color: #F4F7FE"
                    field="totalComment"
                    header="SL KH gửi bình luận"
                  >
                  </Column>
                  <Column
                    headerStyle="background-color: #DAE3FC"
                    bodyStyle="background-color: #F4F7FE"
                    header="Tổng"
                  >
                    <template #body="slotProps">
                      <span>{{
                        slotProps.data.totalComment +
                          slotProps.data.totalMessage
                      }}</span>
                    </template>
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
        { id: 1, date: "20/10/2020", totalComment: 10, totalMessage: 12 },
        { id: 2, date: "21/10/2020", totalComment: 12, totalMessage: 2 },
        { id: 3, date: "22/10/2020", totalComment: 2, totalMessage: 0 },
        { id: 4, date: "23/10/2020", totalComment: 1, totalMessage: 2 },
        { id: 5, date: "24/10/2020", totalComment: 0, totalMessage: 0 },
        { id: 6, date: "25/10/2020", totalComment: 0, totalMessage: 2 },
        { id: 7, date: "26/10/2020", totalComment: 0, totalMessage: 32 },
        { id: 8, date: "27/10/2020", totalComment: 20, totalMessage: 2 },
        { id: 9, date: "28/10/2020", totalComment: 15, totalMessage: 1 },
      ],
      multiAxisData: {
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
            label: "SL KH Gửi Tin nhắn",
            fill: false,
            backgroundColor: "#42A5F5",
            borderColor: "#42A5F5",
            yAxisID: "y-axis-1",
            data: [12, 2, 0, 2, 0, 2, 32, 2, 1],
          },
          {
            label: "SL KH Gửi bình luận:",
            fill: false,
            backgroundColor: "#00bb7e",
            borderColor: "#00bb7e",
            yAxisID: "y-axis-2",
            data: [10, 12, 2, 1, 0, 0, 0, 20, 15],
          },
        ],
      },
      multiAxisOptions: {
        responsive: true,
        hoverMode: "index",
        stacked: false,
        scales: {
          yAxes: [
            {
              type: "linear",
              display: true,
              position: "left",
              id: "y-axis-1",
            },
            {
              type: "linear",
              display: true,
              position: "right",
              id: "y-axis-2",
              gridLines: {
                drawOnChartArea: false,
              },
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
@import "./public/assets/sass/custom/components/customer-report";
</style>
