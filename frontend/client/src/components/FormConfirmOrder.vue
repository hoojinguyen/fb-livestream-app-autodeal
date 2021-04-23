<template>
  <div class="sale-form-confirm">
    <div class="sale-form-confirm__input">
      <!-- Form dien thong tin nguoi dung -->
      <div class="sale-form-confirm__input__info-receiver">
        <p class="title">Thông tin người nhận</p>
        <div class="p-fluid">
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label for="name" class="p-col-3 p-mb-0 p-pl-5">Người nhận *</label>
            <div class="p-col-9 p-pr-5">
              <InputText
                id="name"
                type="text"
                :value="formReceiver.receiver"
                v-model="formReceiver.receiver"
                placeholder="Nhập tên người nhận"
              />
            </div>
          </div>
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label for="phone" class="p-col-3 p-mb-0 p-pl-5"
              >Số điện thoại *</label
            >
            <div class="p-col-9 p-pr-5">
              <InputText
                id="phone"
                type="text"
                :value="formReceiver.phone"
                v-model="formReceiver.phone"
                placeholder="Nhập SĐT người nhận"
              />
            </div>
          </div>
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label for="address" class="p-col-3 p-mb-0 p-pl-5"
              >Địa chỉ giao hàng *</label
            >
            <div class="p-col-9 p-pr-5">
              <InputText
                id="address"
                type="text"
                :value="formReceiver.address"
                v-model="formReceiver.address"
                placeholder="Nhập địa chỉ người nhận"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Form dien thong tin nguoi dung -->

      <!-- Form dien thong tin goi hang -->
      <div class="sale-form-confirm__input__info-package">
        <p class="title">Thông tin gói hàng</p>
        <div class="p-fluid">
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label for="weight" class="p-col-3 p-mb-0 p-pl-5"
              >Trọng lượng (g)</label
            >
            <div class="p-col-9 p-pr-5">
              <InputText
                id="weight"
                type="number"
                :value="formPackage.weight"
                v-model="formPackage.weight"
                placeholder="Nhập khối lượng gói hàng"
              />
            </div>
          </div>
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label for="size" class="p-col-3 p-mb-0 p-pl-5"
              >Kích thước (cm)</label
            >
            <div class="p-col-9 p-pr-5">
              <InputText
                id="size"
                type="text"
                :value="formPackage.size"
                v-model="formPackage.size"
                placeholder="Nhập kích thước gói hàng theo cú pháp dài/rộng/cao"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Form dien thong tin goi hang -->

      <!-- Form dien thong tin don vi van chuyen -->
      <div class="sale-form-confirm__info-delivery">
        <p class="title">Thông tin giao hàng</p>
        <div class="p-fluid">
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label for="codPrice" class="p-col-3 p-mb-0 p-pl-5"
              >Thu hộ (COD) *</label
            >
            <div class="p-col-9 p-pr-5">
              <InputNumber
                id="codPrice"
                :value="formDelivery.codPrice"
                v-model="formDelivery.codPrice"
                placeholder="Nhập số tiền thu hộ"
              />
            </div>
          </div>
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label for="depositPrice" class="p-col-3 p-mb-0 p-pl-5"
              >Đặt cọc</label
            >
            <div class="p-col-9 p-pr-5">
              <InputNumber
                id="depositPrice"
                :value="formDelivery.depositPrice"
                v-model="formDelivery.depositPrice"
                placeholder="Nhập số tiền đặt cọc"
              />
            </div>
          </div>
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label for="shippingPrice" class="p-col-3 p-mb-0 p-pl-5"
              >Phí Shipping *</label
            >
            <div class="p-col-9 p-pr-5">
              <InputNumber
                id="shippingPrice"
                :value="formDelivery.shippingPrice"
                v-model="formDelivery.shippingPrice"
                placeholder="Nhập phí giao hàng"
              />
            </div>
          </div>
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label class="p-col-3 p-mb-0 p-pl-5">Đối tác giao hàng *</label>
            <div class="p-col-9 p-pr-5">
              <div class="partner">
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
                <div class="partner__create">
                  <Button
                    icon="pi pi-plus"
                    class="p-button"
                    @click="toggleDialog(true)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label for="deliveryDate" class="p-col-3 p-mb-0 p-pl-5"
              >Ngày giao hàng *</label
            >
            <div class="p-col-9 p-pr-5">
              <Calendar
                id="deliveryDate"
                :showIcon="true"
                v-model="formDelivery.deliveryDate"
              />
            </div>
          </div>
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label for="receiptDate" class="p-col-3 p-mb-0 p-pl-5"
              >Ngày nhận hàng *</label
            >
            <div class="p-col-9 p-pr-5">
              <Calendar
                id="receiptDate"
                :showIcon="true"
                v-model="formDelivery.receiptDate"
              />
            </div>
          </div>
          <div class="p-field p-grid p-mt-0 p-mb-0">
            <label for="note" class="p-col-3 p-mb-0 p-pl-5">Ghi chú</label>
            <div class="p-col-9 p-pr-5">
              <span class="p-float-label">
                <Textarea
                  id="note"
                  :value="formDelivery.note"
                  v-model="formDelivery.note"
                  rows="3"
                  placeholder="Thêm ghi chú"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- Form dien thong tin don vi van chuyen -->
    </div>

    <!-- Button Action -->
    <div class="sale-form-confirm__button">
      <div class="left">
        <Button
          label="Quay lại"
          icon="pi pi-arrow-left"
          class="p-button-lg p-button-link"
          @click="backTo()"
        />
      </div>
      <div class="right">
        <Button
          label="Huỷ đơn"
          icon="pi pi-trash"
          iconPos="left"
          class="p-button-lg p-button-outlined p-button-danger"
          @click="cancelOrder()"
        >
          <ProgressSpinner
            style="width: 25px; height: 25px"
            v-if="loadingCancel"
          />
        </Button>
        <!-- <Button
          label="Lưu tạm"
          icon="pi pi-save"
          iconPos="left"
          class="p-button-lg p-button-outlined p-button-help p-ml-3"
          @click="saveOrderTemp()"
        >
          <ProgressSpinner
            style="width: 25px; height: 25px"
            v-if="loadingSave"
          />
        </Button> -->
        <Button
          label="Giao hàng"
          icon="pi pi-shopping-cart"
          iconPos="right"
          class="p-button-lg p-ml-3"
          @click="confirmOrder()"
        >
          <ProgressSpinner
            style="width: 25px; height: 25px"
            v-if="loadingFinish"
          />
        </Button>
      </div>
    </div>
    <!-- Button Action -->

    <!-- Dialog them don vi van chuyen ca nhan -->

    <Dialog
      :visible.sync="isOpenDialog"
      :style="{ width: '700px' }"
      header="Thêm mới đối tác giao hàng cá nhân"
      :modal="true"
    >
      <!-- Thong tin co ban -->
      <div class="confirmation-content" style="text-align: left">
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-6">
            <label for="code">Mã đối tác GH</label>
            <InputText
              id="code"
              v-model="formCarrier.code"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !formCarrier.code }"
            />
            <small class="p-invalid" v-if="submitted && !formCarrier.code"
              >Mã đối tác giao hàng không hợp lệ.</small
            >
          </div>
          <div class="p-field p-col-6">
            <label for="name">Tên đối tác GH</label>
            <InputText
              id="name"
              v-model="formCarrier.name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !formCarrier.name }"
            />
            <small class="p-invalid" v-if="submitted && !formCarrier.name"
              >Tên đối tác giao hàng không hợp lệ.</small
            >
          </div>

          <div class="p-field p-col-6">
            <label>Loại đối tác</label>
            <div class="p-grid">
              <div
                v-for="type of typies"
                :key="type"
                class="p-field-radiobutton p-col-6 p-mt-3"
              >
                <RadioButton
                  :id="type"
                  :value="type"
                  name="type"
                  v-model="formCarrier.type"
                />
                <label :for="type">{{ typeFormat(type) }}</label>
              </div>
            </div>
            <small class="p-invalid" v-if="submitted && !formCarrier.type"
              >Chưa chọn loại đối tác.
            </small>
          </div>

          <div class="p-field p-col-6">
            <label>Loại dịch vụ</label>
            <div class="p-grid">
              <div
                v-for="service of servicies"
                :key="service"
                class="p-field-radiobutton p-col-6 p-mt-3"
              >
                <RadioButton
                  :id="service"
                  :value="service"
                  name="service"
                  v-model="formCarrier.service"
                />
                <label :for="service">{{ typeFormat(service) }}</label>
              </div>
            </div>
            <small class="p-invalid" v-if="submitted && !formCarrier.service"
              >Chưa chọn loại dịch vụ.
            </small>
          </div>

          <div class="p-field p-col-6">
            <label for="phone">Điện thoại</label>
            <InputText
              id="phone"
              v-model="formCarrier.phone"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !formCarrier.phone }"
            />
            <small class="p-invalid" v-if="submitted && !formCarrier.phone"
              >SĐT không hợp lệ.
            </small>
          </div>

          <div class="p-field p-col-6">
            <label for="email">Email</label>
            <InputText
              id="email"
              v-model="formCarrier.email"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !formCarrier.email }"
            />
            <small class="p-invalid" v-if="submitted && !formCarrier.email"
              >Email không hợp lệ.
            </small>
          </div>

          <div class="p-field p-col-12">
            <label for="phone">Địa chỉ</label>
            <InputText
              id="address"
              v-model="formCarrier.address"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !formCarrier.address }"
            />
            <small class="p-invalid" v-if="submitted && !formCarrier.address"
              >SĐT không hợp lệ.
            </small>
          </div>
        </div>
      </div>

      <!-- Thong tin co ban -->

      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="toggleDialog(false)"
        />
        <Button label="Lưu" icon="pi pi-check" @click="saveCarrier()"> </Button>
      </template>
    </Dialog>
    <!-- Dialog them don vi van chuyen ca nhan -->
  </div>
</template>

<script>
import { deepClone } from "@/utils";

export default {
  props: {
    hasOrder: { type: Boolean, default: false },
    order: { type: Object, default: null },
    customer: { type: Object, default: null },
    carriers: { type: Array, default: () => [] },
    loadingSave: { type: Boolean, default: false },
    loadingFinish: { type: Boolean, default: false },
    loadingCancel: { type: Boolean, default: false },
  },

  data() {
    return {
      submitted: false,
      isOpenDialog: false,
      selectedPartner: null,
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
      formCarrier: {},
      typies: ["company", "personal"],
      servicies: ["express", "standard"],
    };
  },

  watch: {
    order(value) {
      if (value) {
        this.formDelivery.codPrice = Number(value.total) || 0;
      }
    },

    customer(value) {
      if (value) {
        this.formReceiver = deepClone({
          receiver: value.name || "",
          address: value.address || "",
          phone: value.phone || "",
        });
      }
    },
  },

  methods: {
    saveCarrier() {
      this.submitted = true;

      if (this.formCarrier.name) {
        this.$emit("createCarrier", this.formCarrier);
        this.formCarrier = {};
        this.isOpenDialog = false;
      }
    },

    toggleDialog(value) {
      this.isOpenDialog = value;
    },

    typeFormat(type) {
      if (type == "company") return "Tổ chức";
      else if (type == "personal") return "Cá nhân";
      else if (type == "express") return "GH nhanh";
      else if (type == "standard") return "GH tiêu chuẩn";
    },

    backTo() {
      this.$emit("backTo", "confirm-order");
    },

    cancelOrder() {
      this.$emit("cancel", { status: 0, order: this.order });
    },

    saveOrderTemp() {
      this.$emit("save-and-back", this.order);
    },

    confirmOrder() {
      if (!this.validate()) return;

      const shipping = {
        status: 3,
        order: this.order,
        shippingInformation: {
          ...this.formPackage,
          ...this.formReceiver,
          ...this.formDelivery,
        },
      };
      shipping.shippingInformation.carrierId =
        shipping.shippingInformation.carrierId.id;
      this.$emit("confirm", shipping);
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
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/form-confirm-order";
</style>
