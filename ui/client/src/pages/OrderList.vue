<template>
  <div class="order-list-container">
    <Dialog
      :visible.sync="isOpenPopUpWarning"
      :style="{ width: '450px' }"
      :header="titleWarning"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="orderCurrent">{{ contentWarning }}</span>
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="closePopUpWarning"
        />
        <Button label="Đồng ý" icon="pi pi-check" @click="confirmWarning()">
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>

    <Dialog
      :visible.sync="isOpenPopUpDelete"
      :style="{ width: '30vw' }"
      :modal="true"
      header="Cảnh báo"
    >
      <div class="confirmation-content">
        <span v-if="orderDeleteCurrent">{{ contentDelete }}</span>
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="closePopUpDelete"
        />
        <Button
          label="Đồng ý"
          icon="pi pi-check"
          @click="confirmDeleteDetails()"
        >
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>

    <PopUpConfirmShipping
      :visible="isOpenPopUpConfirm"
      :order="orderCurrent"
      :loading="isLoadingButton"
      :carriers="carriers"
      :isUpdate="isUpdatePopUp"
      :showListDetail="isUpdatePopUp"
      @confirm="confirmShipping"
      @update="updateShipping"
      @close="closePopUp"
    />

    <div class="order-list">
      <h3>Danh sách đơn hàng</h3>
      <SelectButton
        v-model="valueFilterButton"
        :options="filtersButton"
        optionLabel="name"
        class="p-pt-2 p-pb-4"
      />
      <div class="card">
        <DataTable
          :loading="isLoading"
          :value="orders"
          :paginator="true"
          :rows="12"
          :filters="filters"
          :selection="selectedOrder"
          :scrollable="true"
          scrollHeight="500px"
          selectionMode="single"
          dataKey="id"
          stateStorage="session"
          stateKey="dt-state-demo-local"
          class="p-datatable-lg"
        >
          <template #header>
            <span class="p-input-icon-left p-col-12">
              <i class="pi pi-search p-pl-2" />
              <InputText
                class="p-col-12 p-pl-5"
                v-model="filters['global']"
                placeholder="Nhập mã đơn hàng, Số hóa đơn, Mã vận đơn, Tên khách hàng, Số điện thoại để tìm kiếm"
              />
            </span>
          </template>
          <Column field="code" header="Mã đơn hàng" :sortable="true">
            <template #body="slotProps">
              <!-- <span
                class="order-code-highlight"
                @click="openOrderDetail(slotProps.data)"
                v-tooltip.top="'Nhấp vào để xem chi tiết'"
                >{{ slotProps.data.code }}</span
              > -->
              <a
                :href="`/order/detail/${slotProps.data.id}`"
                class="order-code-highlight"
                v-tooltip.top="'Nhấp vào để xem chi tiết'"
                >{{ slotProps.data.code }}
              </a>
            </template>
          </Column>
          <!-- <Column field="bill.code" header="Mã hoá đơn" /> -->
          <!-- <Column field="shippingInformation.code" header="Mã vận đơn" /> -->
          <Column field="createdAt" header="Ngày tạo đơn" :sortable="true">
            <template #body="slotProps">
              <span>{{ slotProps.data.createdAt | formatDateAndTime() }}</span>
            </template>
          </Column>
          <Column field="deliveryDate" header="Ngày giao hàng" :sortable="true">
            <template #body="slotProps">
              <span
                v-if="
                  slotProps.data.shippingInformation &&
                    slotProps.data.shippingInformation.length
                "
                >{{
                  slotProps.data.shippingInformation[0].deliveryDate
                    | formatDate()
                }}
              </span>
              <span v-else></span>
            </template>
          </Column>
          <Column
            field="expectedReceiptDate"
            header="Ngày nhận hàng"
            :sortable="true"
          >
            <template #body="slotProps">
              <span
                v-if="
                  slotProps.data.shippingInformation &&
                    slotProps.data.shippingInformation.length
                "
                >{{
                  slotProps.data.shippingInformation[0].receiptExpectedDate
                    | formatDate()
                }}
              </span>
              <span v-else></span>
            </template>
          </Column>
          <Column
            field="customer.name"
            header="Người mua hàng"
            :sortable="true"
          >
            <template #body="slotProps">
              <span v-if="slotProps.data.customer">{{
                slotProps.data.customer.name
              }}</span>
              <span v-else></span>
            </template>
          </Column>
          <Column field="total" header="Tổng thanh toán" :sortable="true">
            <template #body="slotProps">
              <span>{{ slotProps.data.total | formatMoney() }}</span>
            </template>
          </Column>
          <Column field="status" header="Trạng thái" :sortable="true">
            <template #body="slotProps">
              <span :class="`${formatStatus(slotProps.data.status, true)}`">
                {{ formatStatus(slotProps.data.status, false) }}
              </span>
            </template>
          </Column>
          <Column field="" header="Chuyển trạng thái" headerStyle="width: 15%">
            <template #body="slotProps">
              <OrderStatus
                :status="slotProps.data.status + 1"
                :order="slotProps.data"
                @confirm-order="confirmOrder"
                @update-order="updateOrderStatus"
                @refund-order="openPopupWarning"
                @show-popup="openPopUp"
              />
            </template>
          </Column>
          <Column :exportable="false" header="Tác vụ" headerStyle="width: 20%">
            <template #body="slotProps">
              <template v-if="showDeleteButton(slotProps.data.status)">
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-outlined p-mr-2"
                  v-tooltip.top="'Xoá đơn hàng'"
                  @click="openPopUpDeleteOrder(slotProps.data)"
                />
              </template>
              <template v-if="showUpdateButton(slotProps.data.status)">
                <Button
                  icon="pi pi-ban"
                  class="p-button-rounded p-button-help p-button-outlined p-mr-2"
                  v-tooltip.top="'Huỷ đơn hàng'"
                  @click="
                    openPopupWarning({
                      order: slotProps.data,
                      status: slotProps.data.status,
                    })
                  "
                />

                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-warning p-button-outlined p-mr-2"
                  v-tooltip.top="'Cập nhật'"
                  @click="openPopUpUpdate(slotProps.data)"
                />
              </template>
            </template>
          </Column>
          <template #expansion="slotProps">
            <div
              class="products-wrapper"
              v-if="slotProps.data.details && slotProps.data.details.length"
            >
              <DataTable
                :value="slotProps.data.details"
                :scrollable="true"
                scrollHeight="300px"
                class="p-datatable-striped p-datatable-gridlines"
              >
                <template #header>
                  <div class="table-header">
                    <span class="title-detail">Chi tiết đơn hàng</span>
                  </div>
                </template>
                <Column field="code" header="Mã đơn"></Column>
                <Column field="variant.sku" header="Mã SKU"></Column>
                <Column field="variant.name" header="Tên"></Column>
                <Column field="quantity" header="Số lượng"></Column>
                <Column field="total" header="Thành tiền">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.total | formatMoney() }}</span>
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

          <template #empty>
            <div class="no-found">
              <p class="p-mt-2">Chưa có dữ liệu</p>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { filtersButton } from "@/constants/order.js";
import OrderStatus from "@/components/OrderStatus";
import PopUpConfirmShipping from "@/components/PopUpConfirmShipping";

import { getJSONStorageReader } from "@/helpers/local-storage.js";

const pageCurrentLocal = getJSONStorageReader("pageCurrent");

export default {
  components: {
    OrderStatus,
    PopUpConfirmShipping,
  },

  data() {
    return {
      pageCurrent: pageCurrentLocal.get(),
      isOpenPopUpConfirm: false,
      isOpenPopUpWarning: false,
      titleWarning: "",
      contentWarning: "",
      selectedOrder: null,
      filters: {},
      filtersButton: filtersButton,
      valueFilterButton: filtersButton[0],
      orderCurrent: null,
      isCancelOrder: false,
      isUpdatePopUp: false,
      isOpenPopUpDelete: false,
      contentDelete: "",
      orderDeleteCurrent: null,
    };
  },

  mounted() {
    this.getOrders();
    this.getCarriers();
  },

  beforeDestroy() {
    this.$store.commit("order/setOrder", null);
  },

  watch: {
    valueFilterButton(value) {
      if (value) {
        this.$store.commit("order/filterOrders", {
          orders: this.ordersTemp,
          status: value.status,
        });
      }
    },
  },

  computed: {
    ...mapState({
      orders: (state) => state.order.orders,
      ordersTemp: (state) => state.order.ordersTemp,
      statusCreate: (state) => state.order.status.create,
      statusUpdate: (state) => state.order.status.update,
      statusDelete: (state) => state.order.status.delete,
      isLoading: (state) => state.order.isLoading,
      isLoadingButton: (state) => state.order.isLoadingButton,
      carriers: (state) => state.carrier.carriers,
    }),
  },

  methods: {
    ...mapActions({
      getOrders: "order/fetchAll",
      getOrder: "order/fetchById",
      createOrder: "order/create",
      updateOrder: "order/update",
      cancelOrder: "order/cancel",
      deleteOrder: "order/delete",
      deleteDetails: "order/deleteDetails",
      getCarriers: "carrier/fetchAll",
      updateShippingInOrder: "order/updateShipping",
    }),

    openOrderDetail(order) {
      const redirect = "/orders";
      this.$router.push(`/order/detail/${order.id}?redirect=${redirect}`);
    },

    openPopupWarning(args) {
      this.titleWarning = "Huỷ đơn";
      this.contentWarning = "Bạn chắc chắn muốn huỷ đơn hàng !";
      this.isCancelOrder = true;

      if (args.status == 7) {
        this.titleWarning = "Trả hàng";
        this.contentWarning = "Bạn chắc chắn muốn trả đơn hàng !";
        this.isCancelOrder = false;
      }

      this.isOpenPopUpWarning = true;
      this.orderCurrent = args.order;
    },

    closePopUpWarning() {
      this.isOpenPopUpWarning = false;
      this.orderCurrent = null;
    },

    openPopUpDeleteOrder(order) {
      let ids = [];
      if (order.details.length) {
        ids = order.details.map((el) => el.id);
      }

      this.contentDelete = "Bạn Chắc chắn muốn xoá luôn đơn hàng";
      this.isOpenPopUpDelete = true;
      this.orderDeleteCurrent = {
        all: true,
        orderId: order.id,
        status: order.status,
        ids,
      };
    },

    openPopUpDelete(args) {
      if (args.all) {
        this.contentDelete = "Bạn Chắc chắn muốn xoá luôn đơn hàng";
      } else {
        this.contentDelete =
          "Bạn Chắc chắn muốn xoá những sản phẩm đã chọn trong đơn hàng";
      }
      this.orderDeleteCurrent = args;
      this.isOpenPopUpDelete = true;
    },

    closePopUpDelete() {
      this.isOpenPopUpDelete = false;
      this.contentDelete = "";
      this.orderDeleteCurrent = null;
    },

    async confirmDeleteDetails() {
      let { all, orderId, status, ids } = this.orderDeleteCurrent;
      await this.deleteDetails({ ids, orderId, status });
      if (all) {
        await this.deleteOrder({ ids: [orderId] });
      }
      await this.getOrders();
      await this.updateFilterOrders();
      await this.closePopUpDelete();
    },

    openPopUp(args) {
      this.isOpenPopUpConfirm = true;
      this.orderCurrent = args.order;
    },

    closePopUp() {
      this.isUpdatePopUp = false;
      this.isOpenPopUpConfirm = false;
      this.orderCurrent = null;
    },

    openPopUpUpdate(args) {
      this.isUpdatePopUp = true;
      this.isOpenPopUpConfirm = true;
      this.orderCurrent = args;
    },

    async confirmWarning() {
      let facebookAccessToken = null;
      if (this.pageCurrent) {
        facebookAccessToken = this.pageCurrent.accessToken;
      }

      if (this.isCancelOrder) {
        await this.cancelOrder({
          order: this.orderCurrent,
          status: 0,
          facebookAccessToken,
        });
      } else {
        await this.updateOrder({
          order: this.orderCurrent,
          status: 7,
          facebookAccessToken,
        });
      }
      await this.getOrders();
      await this.closePopUpWarning();
      await this.updateFilterOrders();
    },

    async confirmOrder(args) {
      await this.updateOrder(args);
      await this.getOrders();
      await this.updateFilterOrders();
    },

    async confirmShipping(args) {
      if (args.status == 1) {
        await this.updateOrder({
          status: 2,
          order: args.order,
          facebookAccessToken: args.facebookAccessToken,
        });
      }
      await this.updateOrder({
        status: 3,
        order: args.order,
        shippingInformation: args.shippingInformation,
        facebookAccessToken: args.facebookAccessToken,
      });
      await this.getOrders();
      await this.closePopUp();
      await this.updateFilterOrders();
    },

    async updateShipping(args) {
      await this.updateShippingInOrder(args.shipping);
      if (!args.deleteOrder) {
        await this.getOrders();
        await this.updateFilterOrders();
      }
      await this.closePopUp();

      if (args.deleteOrder) {
        await this.openPopUpDelete(args.deleteOrder);
      }
    },

    async updateOrderStatus(args) {
      await this.updateOrder(args);
      await this.getOrders();
      await this.updateFilterOrders();
    },

    async updateFilterOrders() {
      await this.$store.commit("order/filterOrders", {
        orders: this.ordersTemp,
        status: this.valueFilterButton.status,
      });
    },

    showUpdateButton(status) {
      return status < 4 && status > 0;
    },

    showDeleteButton(status) {
      return status != 5;
    },

    formatStatus(status, isStyle) {
      let tag = "p-tag p-tag";
      let name = "Huỷ đơn";

      switch (status) {
        case 0:
          name = "Đơn bị huỷ";
          tag = `${tag}-danger`;
          break;
        case 1:
          name = "Đã tạo đơn";
          tag = `${tag}-primary`;
          break;
        case 2:
          name = "Đã chốt đơn";
          tag = `${tag}-primary`;
          break;
        case 3:
          name = "Đã xác nhận TT GH";
          tag = `${tag}-primary`;
          break;
        case 4:
          name = "Chờ giao hàng";
          tag = `${tag}-primary`;
          break;
        case 5:
          name = "Đang giao hàng";
          tag = `${tag}-primary`;
          break;
        case 6:
          name = "Đã giao hàng";
          tag = `${tag}-success`;
          break;
        case 7:
          name = "Trả hàng";
          tag = `${tag}-warning`;
          break;
        default:
          name = "Trả hàng";
          break;
      }

      if (isStyle) {
        return tag;
      }
      return name;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/order-list";
</style>
