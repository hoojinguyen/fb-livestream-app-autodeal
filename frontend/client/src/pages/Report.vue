<template>
  <div class="report-page card">
    <TabView class="tabview-custom">
      <TabPanel>
        <template #header>
          <i class="pi pi-copy"></i>
          <span class="p-pl-2">Doanh thu đơn hàng</span>
        </template>
        <div class="report-page__item">
          <OrderReport />
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="pi pi-images"></i>
          <span class="p-pl-2">Doanh thu theo sản phẩm</span>
        </template>
        <div class="report-page__item">
          <ProductReport />
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="pi pi-comments"></i>
          <span class="p-pl-2">SL KH nhắn tin, bình luận</span>
        </template>
        <div class="report-page__item">
          <CustomerReport />
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="pi pi-facebook"></i>
          <span class="p-pl-2">Thống kê tương tác fanpage</span>
        </template>
        <div class="report-page__item">
          <FanpageReport />
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<script>
import OrderReport from "@/components/OrderReport";
import CustomerReport from "@/components/CustomerReport";
import FanpageReport from "@/components/FanpageReport";
import ProductReport from "@/components/ProductReport";

export default {
  components: {
    OrderReport,
    CustomerReport,
    FanpageReport,
    ProductReport,
  },

  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/report";
</style>
