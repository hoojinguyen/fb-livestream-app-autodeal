<template>
  <div class="product-report">
    <div class="product-report__header">
      <p class="pro-title">Báo cáo doanh thu theo sản phẩm</p>
      <FilterReport
        isReportBy="product"
        @getDataReport="getDataReport"
        @changeOptionDisplay="changeOptionDisplay"
      />
    </div>
    <hr />
    <div class="product-report__body vld-parent" ref="productReport">
      <template v-if="!isGetData">
        <p class="rp-no-data">Chưa có dữ liệu ...</p>
      </template>
      <template v-else>
        <div class="pro-chart">
          <div class="p-grid">
            <div class="p-col-6">
              <div class="pro-chart__header">
                <p class="title">Doanh thu theo loại Sản phẩm</p>
                <template v-if="dateFrom && dateTo">
                  <p class="sub-title">
                    Từ {{ dateFrom | formatDate() }} đến
                    {{ dateTo | formatDate() }}
                  </p>
                </template>
                <template v-else>
                  <p class="sub-title">Từ {{ dateFrom | formatDate() }}</p>
                </template>
              </div>
              <div class="pro-chart__body">
                <template v-if="optionDisplay == 'chart'">
                  <div class="data-chart">
                    <Chart type="pie" :data="chartDataCategory" />
                  </div>
                </template>
                <template v-else>
                  <div class="data-table">
                    <DataTable
                      :value="dataTableCategoryReport"
                      :scrollable="true"
                      scrollHeight="450px"
                      class="p-datatable-gridlines"
                    >
                      <Column
                        headerStyle="background-color: #DAE3FC"
                        bodyStyle="background-color: #F4F7FE"
                        field="name"
                        header="Nhóm SP"
                      ></Column>
                      <Column
                        headerStyle="background-color: #DAE3FC"
                        bodyStyle="background-color: #F4F7FE"
                        field="totalSale"
                        header="SL Bán được"
                      ></Column>
                      <Column
                        headerStyle="background-color: #DAE3FC"
                        bodyStyle="background-color: #F4F7FE"
                        field="totalBuyPrice"
                        header="Tổng tiền nhập"
                      >
                        <template #body="slotProps">
                          <span>{{
                            slotProps.data.totalBuyPrice | formatMoney()
                          }}</span>
                        </template>
                      </Column>
                      <Column
                        headerStyle="background-color: #DAE3FC"
                        bodyStyle="background-color: #F4F7FE"
                        field="totalSalePrice"
                        header="Tổng tiền bán"
                      >
                        <template #body="slotProps">
                          <span>{{
                            slotProps.data.totalSalePrice | formatMoney()
                          }}</span>
                        </template>
                      </Column>
                      <Column
                        headerStyle="background-color: #DAE3FC"
                        bodyStyle="background-color: #F4F7FE"
                        field="totalRevenu"
                        header="Doanh thu"
                      >
                        <template #body="slotProps">
                          <span>{{
                            slotProps.data.totalRevenu | formatMoney()
                          }}</span>
                        </template>
                      </Column>
                      <template #footer>
                        <div class="footer-table">
                          <span
                            >Tổng doanh thu:
                            {{ totalRevenuByCategory | formatMoney() }}</span
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
            <div class="p-col-6">
              <div class="pro-chart__header">
                <p class="title">Doanh thu theo từng Sản phẩm</p>
                <template v-if="dateFrom && dateTo">
                  <p class="sub-title">
                    Từ {{ dateFrom | formatDate() }} đến
                    {{ dateTo | formatDate() }}
                  </p>
                </template>
                <template v-else>
                  <p class="sub-title">Từ {{ dateFrom | formatDate() }}</p>
                </template>
              </div>
              <div class="pro-chart__body">
                <template v-if="optionDisplay == 'chart'">
                  <div class="data-chart">
                    <Chart type="polarArea" :data="chartDataProduct" />
                  </div>
                </template>
                <template v-else>
                  <div class="data-table">
                    <DataTable
                      :value="dataTableProductReport"
                      :scrollable="true"
                      scrollHeight="450px"
                      class="p-datatable-gridlines"
                    >
                      <Column
                        headerStyle="background-color: #DAE3FC"
                        bodyStyle="background-color: #F4F7FE"
                        field="name"
                        header="Sản phẩm"
                      ></Column>

                      <Column
                        headerStyle="background-color: #DAE3FC"
                        bodyStyle="background-color: #F4F7FE"
                        field="totalSale"
                        header="SL Bán được"
                      ></Column>
                      <Column
                        headerStyle="background-color: #DAE3FC"
                        bodyStyle="background-color: #F4F7FE"
                        field="totalInventory"
                        header="SL Tồn kho"
                      >
                      </Column>
                      <Column
                        headerStyle="background-color: #DAE3FC"
                        bodyStyle="background-color: #F4F7FE"
                        field="totalBuyPrice"
                        header="Tổng tiền nhập"
                      >
                        <template #body="slotProps">
                          <span>{{
                            slotProps.data.totalBuyPrice | formatMoney()
                          }}</span>
                        </template>
                      </Column>
                      <Column
                        headerStyle="background-color: #DAE3FC"
                        bodyStyle="background-color: #F4F7FE"
                        field="totalSalePrice"
                        header="Tổng tiền bán"
                      >
                        <template #body="slotProps">
                          <span>{{
                            slotProps.data.totalSalePrice | formatMoney()
                          }}</span>
                        </template>
                      </Column>
                      <Column
                        headerStyle="background-color: #DAE3FC"
                        bodyStyle="background-color: #F4F7FE"
                        field="totalRevenu"
                        header="Doanh thu"
                      >
                        <template #body="slotProps">
                          <span>{{
                            slotProps.data.totalRevenu | formatMoney()
                          }}</span>
                        </template>
                      </Column>
                      <template #footer>
                        <div class="footer-table">
                          <span
                            >Tổng doanh thu:
                            {{ totalRevenuByProduct | formatMoney() }}</span
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
      dataTableCategoryReport: [],
      dataTableProductReport: [],
      chartDataProduct: {
        datasets: [
          {
            data: [],
            backgroundColor: [],
            label: "My dataset",
          },
        ],
        labels: [],
      },
      chartDataCategory: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: [],
          },
        ],
      },
    };
  },

  computed: {
    totalRevenuByProduct() {
      let total = 0;
      if (this.dataTableProductReport.length) {
        for (let order of this.dataTableProductReport) {
          total += order.totalRevenu;
        }
      }
      return total;
    },
    totalRevenuByCategory() {
      let total = 0;
      if (this.dataTableCategoryReport.length) {
        for (let order of this.dataTableCategoryReport) {
          total += order.totalRevenu;
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
        container: this.$refs.productReport,
      });
    },

    changeOptionDisplay(value) {
      this.optionDisplay = value;
    },
    async getDataReport(payload) {
      if (payload.reportBy != "product") return;

      await this.setLoading(true);
      const result = await this.$store.dispatch(
        "report/fetchByProduct",
        payload.data
      );
      if (result) {
        this.dateFrom = payload.data.from;
        this.dateTo = payload.data.to;

        this.dataTableProductReport = result.dataProduct;
        this.dataTableCategoryReport = result.dataCategory;

        this.chartDataCategory.labels = result.labelsCategory;
        this.chartDataCategory.datasets[0].data = result.datasetsProduct.total;
        this.chartDataCategory.datasets[0].backgroundColor =
          result.datasetsProduct.backgroundColor;
        this.chartDataCategory.datasets[0].hoverBackgroundColor =
          result.datasetsProduct.backgroundColor;

        this.chartDataProduct.labels = result.labelsProduct;
        this.chartDataProduct.datasets[0].data = result.datasetsProduct.total;
        this.chartDataProduct.datasets[0].backgroundColor =
          result.datasetsProduct.backgroundColor;

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
@import "./public/assets/sass/custom/components/product-report";
</style>
