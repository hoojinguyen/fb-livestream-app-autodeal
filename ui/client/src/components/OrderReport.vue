<template>
  <div class="order-report">
    <div class="order-report__header">
      <p class="or-title">Báo cáo doanh thu theo đơn hàng</p>
      <FilterReport
        isReportBy="order"
        @getDataReport="getDataReport"
        @changeOptionDisplay="changeOptionDisplay"
      />
    </div>
    <hr />
    <div class="order-report__body vld-parent" ref="orderReport">
      <template v-if="!isGetData">
        <p class="rp-no-data">Chưa có dữ liệu ...</p>
      </template>
      <template v-else>
        <div class="or-chart">
          <div class="or-chart__header">
            <p class="title">Doanh thu đơn hàng theo thời gian</p>
            <template v-if="dateFrom && dateTo">
              <p class="sub-title">
                Từ {{ dateFrom | formatDate() }} đến {{ dateTo | formatDate() }}
              </p>
            </template>
            <template v-else>
              <p class="sub-title">Từ {{ dateFrom | formatDate() }}</p>
            </template>
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
                    field="total"
                    header="Số lượng đơn"
                  ></Column>
                  <Column
                    headerStyle="background-color: #DAE3FC"
                    bodyStyle="background-color: #F4F7FE"
                    field="revenue"
                    header="Doanh thu"
                  >
                    <template #body="slotProps">
                      <span>{{ slotProps.data.revenue | formatMoney() }}</span>
                    </template>
                  </Column>
                  <template #footer>
                    <div class="footer-table">
                      <span>Tổng đơn: {{ totalOrder }}</span>
                      <span
                        >Tổng doanh thu: {{ totalRevenu | formatMoney() }}</span
                      >
                    </div>
                  </template>

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
      optionDisplay: "chart",
      dateFrom: new Date(),
      dateTo: new Date(),
      dataTableReport: [],
      multiAxisData: {
        labels: [],
        datasets: [
          {
            label: "Tổng đơn",
            backgroundColor: "#42A5F5",
            yAxisID: "y-axis-1",
            data: [],
          },
          {
            label: "Doanh thu",
            backgroundColor: "#66BB6A",
            yAxisID: "y-axis-2",
            data: [],
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
    setLoading(value) {
      if (!value) return this.loader.hide();

      this.loader = this.$loading.show({
        width: 54,
        height: 54,
        opacity: 0.6,
        loader: "spinner",
        color: "#56A3ED",
        container: this.$refs.orderReport,
      });
    },

    changeOptionDisplay(value) {
      this.optionDisplay = value;
    },

    async getDataReport(payload) {
      if (payload.reportBy != "order") return;

      await this.setLoading(true);
      const result = await this.$store.dispatch(
        "report/fetchByOrder",
        payload.data
      );
      if (result) {
        this.dateFrom = payload.data.from;
        this.dateTo = payload.data.to;

        this.dataTableReport = result.data;
        this.multiAxisData.labels = result.labels;
        this.multiAxisData.datasets[0].data = result.datasets.total;
        this.multiAxisData.datasets[1].data = result.datasets.revenue;

        this.isGetData = true;
      } else {
        this.isGetData = false;
      }
      await this.setLoading(false);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/order-report";
</style>
