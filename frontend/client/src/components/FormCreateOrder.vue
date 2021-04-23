<template>
  <div class="sale-form-create">
    <div class="sale-form-create__header">
      <p class="title">Đơn hàng</p>

      <!-- COUPONS -->

      <OverlayPanel
        ref="op"
        :showCloseIcon="true"
        id="overlay_panel"
        style="width: 300px"
        appendTo="body"
      >
        <div class="p-fluid p-pt-3">
          <div class="p-field p-grid">
            <div class="p-col-6">
              <div class="p-field-radiobutton p-pl-2">
                <RadioButton
                  id="percentRB"
                  name="couponRB"
                  value="percent"
                  v-model="couponForm.type"
                />
                <label for="percentRB">Phần trăm (%)</label>
              </div>
            </div>
            <div class="p-col-6">
              <div class="p-field-radiobutton p-pl-2">
                <RadioButton
                  id="money"
                  name="couponRB"
                  value="money"
                  v-model="couponForm.type"
                />
                <label for="money">Số tiền</label>
              </div>
            </div>
          </div>
        </div>

        <div class="p-fluid">
          <div class="p-field p-grid p-pl-3">
            <div class="p-col-6">
              <InputNumber
                id="percent"
                v-model="couponForm.value"
                :min="0"
                :max="100"
                suffix="%"
                :disabled="couponForm.type == 'money'"
              />
            </div>
            <div class="p-col-6">
              <InputNumber
                v-model="couponForm.value"
                :disabled="couponForm.type == 'percent'"
              />
            </div>
          </div>
        </div>

        <div class="p-grid p-pl-3">
          <span class="p-col-12 p-float-label">
            <Textarea
              class="p-col-12"
              :value="couponForm.reason"
              v-model="couponForm.reason"
              rows="2"
              placeholder="Nhập lý do khuyến mãi"
            />
          </span>
        </div>
        <div class="p-grid">
          <div class="p-col-12 p-d-flex p-jc-end">
            <Button
              label="Đồng ý"
              icon="pi pi-check"
              @click="applyPromotion()"
            />
          </div>
        </div>
      </OverlayPanel>
      <!-- COUPONS -->

      <!-- Input Auto Search Products -->
      <span class="p-fluid">
        <AutoComplete
          class="input-autocomplete"
          :suggestions="filteredVariants"
          :dropdown="true"
          :multiple="true"
          scrollHeight="500px"
          @complete="searchVariants($event)"
          @item-select="selectedVariant($event)"
          placeholder="Nhập tên hàng hoá, mã vạch, mã SKU ..."
          field="sku"
        >
          <template #item="slotProps">
            <div class="input-autocomplete__custom p-grid">
              <div class="p-col-2 custom-image">
                <img :src="slotProps.item.image" />
              </div>
              <div class="p-col-8 custom-title">
                <p class="custom-title__main">{{ slotProps.item.name }}</p>
                <p class="custom-title__sub">{{ slotProps.item.sku }}</p>
              </div>
              <div class="p-col-2 custom-price">
                <span>{{ slotProps.item.sellPrice | formatMoney() }}</span>
              </div>
            </div>
          </template>
        </AutoComplete>
      </span>
      <!-- Input Auto Search Products -->
    </div>

    <div class="sale-form-create__coupon" v-if="orderDetails.length">
      <span class="coupon-content" v-if="coupon">
        <template v-if="coupon.type == 'percent'">
          Khuyến Mãi: {{ coupon.value }} %- {{ coupon.reason }}
        </template>
        <template v-else>
          Khuyến Mãi: {{ coupon.value | formatMoney }} -
          {{ coupon.reason }}
        </template>
      </span>

      <div class="coupon-button">
        <Button
          icon="pi pi-briefcase"
          class="p-button-rounded p-button-outlined"
          v-tooltip.top="'KM hoá đơn'"
          @click="openPromotion($event)"
        />
      </div>
    </div>

    <div class="sale-form-create__body">
      <!-- Danh sach cac products  -->
      <div class="table-product" v-if="orderDetails.length">
        <div class="table-product__header">
          <div class="p-grid">
            <span class="p-col-4"> Tên hàng hoá </span>
            <span class="p-col-2"> Số lượng </span>
            <span class="p-col-2"> Đơn giá </span>
            <span class="p-col-2"> Thành tiền </span>
            <span class="p-col-2"> </span>
          </div>
        </div>
        <div class="table-product__content">
          <div
            class="p-grid p-mt-2"
            v-for="(detail, index) in orderDetails"
            :key="index"
          >
            <span class="p-col-4 name-product">
              <p class="name-product__title">
                {{ detail.variant.name }}
              </p>
              <p class="name-product__subTitle">{{ detail.variant.sku }}</p>
            </span>
            <span class="p-col-2 input-stock">
              <input
                type="number"
                name="stock"
                min="1"
                step="1"
                :value="detail.quantity"
                @change="updateOrderDetail($event, detail, 'quantity')"
              />
            </span>
            <span class="p-col-2 input-price">
              <input
                type="number"
                name="price"
                min="10000"
                step="5000"
                :value="detail.price"
                @change="updateOrderDetail($event, detail, 'price')"
              />
            </span>
            <span class="p-col-2 price-product">
              {{ detail.subTotal | formatMoney() }}
            </span>
            <span class="p-col-2 p-pt-2 icon">
              <Button
                @click="removeOrderDetail(detail)"
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-text p-pl-3"
              />
            </span>
          </div>
        </div>
      </div>
      <!-- Danh sach cac products  -->
    </div>

    <!-- Thong tin tien thanh toan -->
    <div class="sale-form-create__addition">
      <span class="title">Tổng tiền</span>
      <span class="price-total">{{ totalPriceOrder | formatMoney() }}</span>
    </div>
    <!-- Thong tin tien thanh toan -->

    <!-- Button action -->
    <div class="sale-form-create__footer">
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
        <Button
          label="Lưu tạm"
          icon="pi pi-save"
          iconPos="left"
          class="p-button-lg p-button-outlined p-button-help p-ml-3"
          @click="createOrderTemp()"
        >
          <ProgressSpinner
            style="width: 25px; height: 25px"
            v-if="loadingSave"
          />
        </Button>
        <Button
          label="Tiếp tục"
          icon="pi pi-arrow-right"
          iconPos="right"
          class="p-button-lg p-ml-3"
          @click="createOrder()"
        >
          <ProgressSpinner
            style="width: 25px; height: 25px"
            v-if="loadingNext"
          />
        </Button>
      </div>
    </div>
    <!-- Button action -->
  </div>
</template>

<script>
// import { getRandomInt,  trimString, omitObject } from "@/utils";
import { deepClone } from "@/utils";

export default {
  props: {
    customer: { type: Object, default: null },
    loadingNext: { type: Boolean, default: false },
    loadingSave: { type: Boolean, default: false },
    loadingCancel: { type: Boolean, default: false },
    variants: { type: Array, default: () => [] },
  },

  data() {
    return {
      filteredVariants: null,
      coupon: null,
      couponForm: {
        name: "",
        code: "",
        reason: "",
        type: "percent",
        value: 0,
      },
      orderDetails: [],
      count: 100,
    };
  },

  computed: {
    totalPriceOrder() {
      let total = 0;
      this.orderDetails.map((el) => {
        total += el.total;
      });
      if (this.coupon) {
        let value = Number(this.coupon.value);
        if (this.coupon.type == "percent") {
          total -= (total * value) / 100;
        } else {
          total -= value;
        }
      }
      return total;
    },
  },

  methods: {
    selectedVariant({ value }) {
      const details = {
        id: this.count,
        variant: value,
        variantId: value.id,
        price: value.sellPrice,
        quantity: 1,
        total: value.sellPrice,
        subTotal: value.sellPrice,
      };
      this.orderDetails.push(deepClone(details));
      this.count += 1;
    },

    searchVariants(event) {
      setTimeout(() => {
        if (!event.query.trim().length) {
          this.filteredVariants = [...this.variants];
        } else {
          this.filteredVariants = this.variants.filter((variant) => {
            return variant.sku
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          });
        }
      }, 250);
    },

    createOrder() {
      if (this.orderDetails.length) {
        this.$emit("create-and-next", {
          details: this.orderDetails,
          coupon: this.coupon,
          customer: this.customer,
        });
      } else {
        console.error("chua co hang");
      }
    },

    createOrderTemp() {
      if (this.orderDetails.length) {
        this.$emit("create-and-back", {
          details: this.orderDetails,
          coupon: this.coupon,
          customer: this.customer,
        });
      } else {
        console.error("chua co hang");
      }
    },

    cancelOrder() {
      this.$emit("cancel");
    },

    backTo() {
      this.$emit("backTo", "create-order");
    },

    removeOrderDetail({ id }) {
      this.orderDetails = this.orderDetails.filter((el) => el.id !== id);
    },

    updateOrderDetail(event, detail, property) {
      const { value } = event.target;
      const { id } = detail;

      if (property == "quantity" && value < 1) return;
      if (property == "price" && value < 10000) return;

      this.orderDetails.map((el) => {
        if (el.id == id) {
          if (property == "quantity") {
            el.quantity = value;
            el.total = el.price * value;
            el.subTotal = el.price * value;
          } else if (property == "price") {
            el.price = value;
            el.total = el.quantity * value;
            el.subTotal = el.quantity * value;
          }
        }
        return el;
      });
    },

    openPromotion(event) {
      this.$refs.op.toggle(event);
    },

    applyPromotion() {
      this.$refs.op.hide();
      this.coupon = deepClone(this.couponForm);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/form-create-order";
</style>
