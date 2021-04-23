<template>
  <Dialog
    :visible.sync="isOpen"
    :style="{ width: '45vw' }"
    :header="title"
    :modal="true"
    @hide="$emit('close')"
  >
    <div class="popup-order vld-parent" ref="popupShipping">
      <template v-if="showInfoShipping">
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-6">
            <label for="deliveryDate">Ngày giao hàng *</label>
            <Calendar
              id="deliveryDate"
              :showIcon="true"
              v-model="formDelivery.deliveryDate"
            />
          </div>
          <div class="p-field p-col-6">
            <label for="receiptDate">Ngày nhận hàng *</label>
            <Calendar
              id="receiptDate"
              :showIcon="true"
              v-model="formDelivery.receiptDate"
            />
          </div>
          <div class="p-field p-col-6">
            <label for="name">Người nhận *</label>
            <InputText
              id="name"
              type="text"
              :value="formReceiver.receiver"
              v-model="formReceiver.receiver"
              placeholder="Nhập tên người nhận"
            />
          </div>
          <div class="p-field p-col-6">
            <label for="phone">Số điện thoại *</label>
            <InputText
              id="phone"
              type="text"
              :value="formReceiver.phone"
              v-model="formReceiver.phone"
              placeholder="Nhập SĐT người nhận"
            />
          </div>
          <div class="p-field p-col-12">
            <label for="address">Địa chỉ giao hàng *</label>
            <Textarea
              id="address"
              type="text"
              :value="formReceiver.address"
              v-model="formReceiver.address"
              rows="3"
              cols="20"
              placeholder="Nhập địa chỉ người nhận"
            />
          </div>
        </div>
      </template>
      <template v-if="showInfoPackage">
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-4">
            <label for="weight">Trọng lượng (g)</label>
            <InputText
              id="weight"
              type="number"
              :value="formPackage.weight"
              v-model="formPackage.weight"
              placeholder="Nhập khối lượng gói hàng"
            />
          </div>
          <div class="p-field p-col-4">
            <label for="size">Kích thước (cm)</label>
            <InputText
              id="size"
              type="text"
              :value="formPackage.size"
              v-model="formPackage.size"
              placeholder="dài/rộng/cao"
            />
          </div>
          <div class="p-field p-col-4">
            <label>Đối tác giao hàng *</label>
            <Dropdown
              class="partner__dropdown"
              v-model="formDelivery.carrierId"
              optionLabel="name"
              placeholder="Chọn một đối tác giao hàng"
              :options="carriers"
              :filter="true"
              :showClear="true"
            >
              <template #value="slotProps">
                <span v-if="slotProps.value">
                  {{ slotProps.value.name }}
                </span>
              </template>
              <template #option="slotProps">
                <span>{{ slotProps.option.name }}</span>
              </template>
            </Dropdown>
          </div>
        </div>
      </template>
      <template v-if="showInfoCarrier">
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-4">
            <label for="codPrice">Thu hộ (COD)</label>
            <InputNumber
              id="codPrice"
              :value="formDelivery.codPrice"
              v-model="formDelivery.codPrice"
              placeholder="Nhập số tiền thu hộ"
            />
          </div>
          <div class="p-field p-col-4">
            <label for="depositPrice">Đặt cọc</label>
            <InputNumber
              id="depositPrice"
              :value="formDelivery.depositPrice"
              v-model="formDelivery.depositPrice"
              placeholder="Nhập số tiền đặt cọc"
            />
          </div>
          <div class="p-field p-col-4">
            <label for="shippingPrice">Phí Shipping *</label>
            <InputNumber
              id="shippingPrice"
              :value="formDelivery.shippingPrice"
              v-model="formDelivery.shippingPrice"
              placeholder="Nhập phí giao hàng"
            />
          </div>
          <div class="p-field p-col-12">
            <label for="note">Ghi chú</label>
            <Textarea
              id="note"
              :value="formDelivery.note"
              v-model="formDelivery.note"
              rows="3"
              placeholder="Thêm ghi chú"
            />
          </div>
        </div>
      </template>
      <template v-if="showListDetail && details.length">
        <DataTable
          :value="details"
          :scrollable="true"
          scrollHeight="300px"
          class="p-datatable-striped p-datatable-gridlines"
        >
          <template #header>
            <div class="table-header">
              <span class="title-detail">Chi tiết đơn hàng</span>
            </div>
          </template>
          <Column field="variant.sku" header="Mã sản phẩm"></Column>
          <Column field="quantity" header="Số lượng"></Column>
          <Column field="total" header="Thành tiền">
            <template #body="slotProps">
              <span>{{ slotProps.data.total | formatMoney() }}</span>
            </template>
          </Column>
          <Column :exportable="false">
            <template #body="slotProps">
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-outlined p-button-small"
                v-tooltip.top="'Xoá'"
                @click="deleteDetails(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </div>
    <template #footer>
      <Button
        label="Huỷ bỏ"
        icon="pi pi-times"
        class="p-button-text"
        @click="$emit('close')"
      />
      <Button
        label="Lưu"
        icon="pi pi-check"
        class="p-button-text"
        @click="saveShipping()"
      />
    </template>
  </Dialog>
</template>

<script>
import { deepClone } from "@/utils";
import { getJSONStorageReader } from "@/helpers/local-storage.js";

const pageCurrentLocal = getJSONStorageReader("pageCurrent");

export default {
  props: {
    title: { type: String, default: "Thông tin giao hàng" },
    visible: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    order: { type: Object, default: null },
    carriers: { type: Array, default: () => [] },
    showInfoPackage: { type: Boolean, default: true },
    showInfoShipping: { type: Boolean, default: true },
    showInfoCarrier: { type: Boolean, default: true },
    showListDetail: { type: Boolean, default: true },
    isUpdate: { type: Boolean, default: false },
  },

  data() {
    return {
      submitted: false,
      isOpen: false,
      loader: null,
      pageCurrent: pageCurrentLocal.get(),
      formReceiver: {
        receiver: "",
        address: "",
        phone: "",
      },
      formPackage: {
        size: "",
        weight: 0,
      },
      formDelivery: {
        codPrice: 0,
        depositPrice: 0,
        shippingPrice: 0,
        deliveryDate: "",
        receiptDate: "",
        carrierId: "",
        note: "",
      },
      shippingId: null,
      details: [],
      detailsLength: 0,
      detailsDelete: [],
    };
  },

  watch: {
    visible(value) {
      this.isOpen = value;
      if (!value) {
        this.resetDefault();
      }
    },

    loading(value) {
      if (!value) return this.loader.hide();
      this.loader = this.$loading.show({
        width: 54,
        height: 54,
        opacity: 0.6,
        loader: "spinner",
        color: "#56A3ED",
        container: this.$refs.popupShipping,
      });
    },

    order(value) {
      if (value) {
        if (this.isUpdate) {
          if (value.details && value.details.length) {
            this.details = deepClone(value.details);
            this.detailsLength = this.details.length;
          }
          if (value.shippingInformation && value.shippingInformation.length) {
            let ship = value.shippingInformation[0];
            this.shippingId = ship.id;
            this.formPackage = deepClone({
              size: ship.size || "",
              weight: ship.weight || 0,
            });
            this.formDelivery = deepClone({
              codPrice: ship.codPrice || 0,
              depositPrice: ship.depositPrice || 0,
              shippingPrice: ship.shippingPrice || 0,
              deliveryDate: ship.deliveryDate || "",
              receiptDate: ship.receiptDate || "",
              carrierId:
                this.carriers.find((ca) => ca.id == ship.carrierId) || "",
              note: ship.note || "",
            });
            this.formReceiver = deepClone({
              receiver: ship.receiver || "",
              address: ship.address || "",
              phone: ship.phone || "",
            });
          } else {
            if (value.customer) {
              this.formReceiver = deepClone({
                receiver: value.customer.name || "",
                address: value.customer.address || "",
                phone: value.customer.phone || "",
              });
            }
            this.shippingId = null;
            this.formDelivery.codPrice = Number(value.total) || 0;
          }
        } else {
          if (value.customer) {
            this.formReceiver = deepClone({
              receiver: value.customer.name || "",
              address: value.customer.address || "",
              phone: value.customer.phone || "",
            });
          }
          this.shippingId = null;
          this.formDelivery.codPrice = Number(value.total) || 0;
        }
      }
    },
  },

  methods: {
    async deleteDetails(detail) {
      this.detailsDelete.push(detail);
      this.details = this.details.filter((el) => el.id !== detail.id);
      this.formDelivery.codPrice -= Number(detail.total);
    },

    async saveShipping() {
      if (!this.validate()) return;

      let deleteOrder = null;
      if (this.detailsDelete.length) {
        deleteOrder = {
          status: this.order.status,
          orderId: this.order.id,
          all: true,
          ids: this.detailsDelete.map((el) => el.id),
        };

        if (this.detailsDelete.length != this.detailsLength) {
          deleteOrder.all = false;
        }
      }

      let facebookAccessToken = null;
      if (this.pageCurrent) {
        facebookAccessToken = this.pageCurrent.accessToken;
      }

      let shippingId = this.shippingId;
      let shipping = {
        facebookAccessToken,
        status: this.order.status,
        order: this.order,
        shippingInformation: {
          ...this.formPackage,
          ...this.formReceiver,
          ...this.formDelivery,
        },
      };

      shipping.shippingInformation.carrierId =
        shipping.shippingInformation.carrierId.id;

      await this.resetDefault();

      if (this.isUpdate && shippingId) {
        await this.$emit("update", {
          deleteOrder,
          shipping: {
            id: shippingId,
            orderId: this.order.id,
            ...shipping.shippingInformation,
          },
        });
      } else {
        await this.$emit("confirm", shipping);
      }
    },

    validate() {
      const { receiver, address, phone } = this.formReceiver;
      const { receiptDate, deliveryDate, carrierId } = this.formDelivery;
      if (
        receiver &&
        address &&
        phone &&
        receiptDate &&
        deliveryDate &&
        carrierId
      ) {
        return true;
      }
      return false;
    },

    resetDefault() {
      this.formReceiver = deepClone({
        receiver: "",
        address: "",
        phone: "",
      });
      this.formPackage = deepClone({
        size: "",
        weight: 0,
      });
      this.formDelivery = deepClone({
        codPrice: 0,
        depositPrice: 0,
        shippingPrice: 0,
        deliveryDate: "",
        receiptDate: "",
        carrierId: "",
        note: "",
      });
      this.shippingId = null;
      this.details = [];
      this.detailsDelete = [];
      this.detailsLength = 0;
    },
  },
};
</script>
