<template>
  <div class="order-report">
    <div class="order-report__header">
      <p class="or-title">Báo cáo số lượng người dùng đăng ký</p>
      <FilterReport
        isReportBy="order"
        @getDataReport="getDataReport"
        @changeOptionDisplay="changeOptionDisplay"
      />
    </div>
    <hr />
    <div class="order-report__body">
      <template v-if="!isGetData">
        <p class="rp-no-data">Chưa có dữ liệu ...</p>
      </template>
      <template v-else>
        <div class="or-chart">
          <div class="or-chart__header">
            <p class="title">Số lượng người dùng đăng ký</p>
            <p class="sub-title">Từ {{ dateFrom }} đến {{ dateTo }}</p>
          </div>
          <div class="or-chart__body">
            <template v-if="optionDisplay == 'chart'">
              <div class="data-chart">
                <Chart
                  type="bar"
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
                  <Column field="date" header="Ngày"></Column>
                  <Column field="total" header="Số lượng"></Column>

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
      dateFrom: "10/01/2021",
      dateTo: "11/01/2021",
      dataTableReport: [
        { id: 1, date: "10/01/2021", total: 10, revenue: 12000000 },
        { id: 2, date: "11/01/2021", total: 12, revenue: 54050000 },
      ],
      multiAxisData: {
        labels: ["10/01/2021", "11/01/2021"],
        datasets: [
          {
            label: "Tổng đơn",
            backgroundColor: "#42A5F5",
            yAxisID: "y-axis-1",
            data: [10, 12],
          },
          {
            label: "Doanh thu",
            backgroundColor: "#66BB6A",
            yAxisID: "y-axis-2",
            data: [12000000, 54050000],
          },
        ],
      },
      multiAxisOptions: {
        responsive: true,
        tooltips: {
          mode: "index",
          intersect: true,
        },
        scales: {
          yAxes: [
            {
              type: "linear",
              display: true,
              position: "left",
              id: "y-axis-1",
              ticks: {
                min: 0,
                max: 100,
              },
            },
            {
              type: "linear",
              display: true,
              position: "right",
              id: "y-axis-2",
              gridLines: {
                drawOnChartArea: false,
              },
              ticks: {
                min: 0,
                max: 100000000,
              },
            },
          ],
        },
      },
    };
  },

  computed: {
    totalOrder() {
      let total = 0;
      if (this.dataTableReport.length) {
        for (let order of this.dataTableReport) {
          total += order.total;
        }
      }
      return total;
    },

    totalRevenu() {
      let total = 0;
      if (this.dataTableReport.length) {
        for (let order of this.dataTableReport) {
          total += order.revenue;
        }
      }
      return total;
    },
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
.order-report {
  .footer-table {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .rp-no-data {
    font-weight: bold;
    font-size: 1.4rem;
    margin-top: 10%;
  }
  &__header {
    .or-title {
      font-size: 1.6rem;
      font-weight: bold;
    }
  }

  &__body {
    text-align: center;
    .or-chart {
      margin-top: 40px;

      &__header {
        .title {
          font-weight: bold;
          font-size: 1.8rem;
          text-transform: uppercase;
        }
        .sub-title {
          font-weight: thin;
          font-style: italic;
          font-size: 1.4rem;
        }
      }

      &__body {
        width: 100%;
        .data-table {
          margin-left: 30%;
          margin-right: 30%;
          margin-top: 30px;
        }

        .data-chart {
          margin-left: 20%;
          margin-right: 20%;
          margin-top: 30px;
        }
      }
    }
  }
}
</style>
