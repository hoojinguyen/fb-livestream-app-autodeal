<template>
  <div class="p-grid dashboard">
    <div class="p-col-12 p-md-3">
      <div class="overview-box overview-box-1">
        <h1>TỔNG VIDEO ĐANG LIVE</h1>
        <div class="overview-value">2</div>
        <div class="overview-ratio">
          <div class="overview-direction">
            <i class="pi pi-arrow-up"></i>
          </div>
        </div>
        <img
          src="assets/layout/images/dashboard/graph-blue.svg"
          alt="apollo-layout"
        />
      </div>
    </div>

    <div class="p-col-12 p-md-3">
      <div class="overview-box overview-box-2">
        <h1>TỔNG TIN NHẮN TRONG NGÀY</h1>
        <div class="overview-value">200</div>
        <div class="overview-ratio">
          <div class="overview-direction">
            <i class="pi pi-arrow-up"></i>
          </div>
        </div>
        <img
          src="assets/layout/images/dashboard/graph-green.svg"
          alt="apollo-layout"
        />
      </div>
    </div>

    <div class="p-col-12 p-md-3">
      <div class="overview-box overview-box-3">
        <h1>TỔNG ĐƠN HÀNG TRONG NGÀY</h1>
        <div class="overview-value">12</div>
        <div class="overview-ratio">
          <div class="overview-direction">
            <i class="pi pi-arrow-up"></i>
          </div>
        </div>
        <img
          src="assets/layout/images/dashboard/graph-yellow.svg"
          alt="apollo-layout"
        />
      </div>
    </div>

    <div class="p-col-12 p-md-3">
      <div class="overview-box overview-box-4">
        <h1>SỐ KHÁCH HÀNG MỚI TRONG NGÀY</h1>
        <div class="overview-value">5</div>
        <div class="overview-ratio">
          <div class="overview-direction">
            <i class="pi pi-arrow-up"></i>
          </div>
        </div>
        <img
          src="assets/layout/images/dashboard/graph-red.svg"
          alt="apollo-layout"
        />
      </div>
    </div>

    <div class="p-col-12 p-lg-12 chat">
      <Panel header="Đơn hàng mới nhất trong ngày" class="no-pad">
        <DataTable
          :value="orders"
          class="p-datatable-customers"
          :rows="20"
          style="margin-bottom: 20px"
        >
          <Column field="code" header="Mã đơn hàng"></Column>
          <Column field="totalPrice" header="Tổng thanh toán">
            <template #body="slotProps">
              {{ slotProps.data.totalPrice | formatMoney() }}
            </template>
          </Column>
          <Column field="status" header="Trạng thái"> </Column>
          <Column>
            <template #body="slotProps">
              <Button
                label="Xem Chi tiết"
                icon="pi pi-search"
                type="button"
                class="p-button-success p-mr-2 p-mb-1"
                @click="openOrderDetail(slotProps.data)"
              ></Button>
              <Button
                label="Huỷ đơn"
                icon="pi pi-times"
                type="button"
                class="p-button-danger p-mb-1"
                @click="cancelOrder(slotProps.data)"
              ></Button>
            </template>
          </Column>
          <template #empty>
            <div style="text-align: center">
              <p class="p-mt-2">CHƯA CÓ ĐƠN HÀNG NÀO TRONG NGÀY ...</p>
            </div>
          </template>
        </DataTable>
      </Panel>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [
        {
          id: 1,
          code: "oder1",
          totalPrice: 450000,
          status: "Đang giao hàng",
        },
        {
          id: 2,
          code: "oder2",
          totalPrice: 350000,
          status: "Đang giao hàng",
        },
      ],
    };
  },
  methods: {
    openOrderDetail(order) {
      const redirect = "/";
      this.$router.push(`/order/detail/${order.id}?redirect=${redirect}`);
    },

    cancelOrder(order) {
      console.log("cancelOrder -> order", order);
      // Goi API huy don hang
    },
  },
};
</script>

<style></style>
