<template>
  <div class="order-detail-wrapper">
    <div class="order-detail" v-if="order">
      <div class="order-detail-header">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-lg p-mt-2"
          @click="goBack()"
        />
        <h2 class="p-ml-3">Chi tiết đơn hàng - {{ order.code }}</h2>
      </div>
      <hr />
      <div class="order-detail-tracking">
        <div class="p-grid">
          <div class="p-col-12 card">
            <TrackingOrder :status="order.status" />
          </div>
        </div>
      </div>
      <div class="order-detail-content">
        <div class="p-grid">
          <div class="p-col-6">
            <div class="odc-wrapper-product">
              <p class="odc-wrapper-product__header">
                Thông tin sản phẩm
              </p>
              <hr class="p-mt-0" />
              <div class="odc-wrapper-product__body">
                <div
                  class="odc-product-item"
                  v-for="detail in order.details"
                  :key="detail.id"
                >
                  <img
                    :src="detail.variant.image"
                    :alt="detail.variant.image"
                    class="odc-product-item__image"
                  />
                  <div class="odc-product-item__info">
                    <p class="odc-product-title">
                      {{ detail.variant.name }}
                    </p>
                    <p class="odc-product-subtitle">
                      {{ detail.quantity }} X {{ detail.price }} =
                      {{ detail.total | formatMoney() }}
                    </p>
                  </div>
                </div>
              </div>
              <hr class="p-mt-0" />
              <div class="odc-wrapper-product__footer">
                <div class="footer-price">
                  <span>Tiền hàng: </span>
                  <span class="p-pl-1">{{
                    order.subtotal | formatMoney()
                  }}</span>
                </div>
                <div class="footer-price">
                  <span>Khuyến mãi: </span>
                  <template v-if="order.coupon">
                    <span class="p-pl-1" v-if="order.coupon.type == 'money'">{{
                      order.coupon.value | formatMoney()
                    }}</span>
                    <span class="p-pl-1" v-else
                      >{{ order.coupon.value }} %</span
                    >
                  </template>

                  <template v-else>
                    <span class="p-pl-1">0</span>
                  </template>
                </div>
                <div class="footer-price-bold">
                  <span>Còn phải thu:</span>
                  <span class="p-pl-1">{{ order.total | formatMoney() }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="p-col-6">
            <div class="odc-wrapper-customer">
              <p class="odc-wrapper-customer__header">
                Thông tin khách hàng
              </p>
              <hr class="p-mt-0 p-mb-0" />
              <div class="odc-wrapper-customer__body">
                <div class="odc-customer-profile">
                  <template
                    v-if="
                      pageCurrent &&
                        order.customer &&
                        order.customer.facebookUserId
                    "
                  >
                    <img
                      :src="
                        order.customer.facebookUserId
                          | getAvatarFbWithToken(pageCurrent.accessToken)
                      "
                      alt="avatar"
                      class="profile-avatar"
                    />
                  </template>
                  <template v-else>
                    <img
                      :src="avatarDefault"
                      alt="avatar"
                      class="profile-avatar"
                    />
                  </template>

                  <div class="profile-infor">
                    <p>
                      <i class="pi pi-fw pi-customer"></i>
                      <span class="p-pl-3">{{ order.customer.name }}</span>
                    </p>
                    <p>
                      <i class="pi pi-fw pi-mobile"></i>
                      <span class="p-pl-3">{{
                        order.customer.phone || "Chưa có thông tin"
                      }}</span>
                    </p>
                    <p>
                      <i class="pi pi-fw pi-map-marker"></i>
                      <span class="p-pl-3">{{
                        order.customer.address || "Chưa có thông tin"
                      }}</span>
                    </p>
                  </div>
                </div>
                <div class="odc-customer-delivery">
                  <div class="delivery-item">
                    <p class="delivery-item__title">Ngày đặt hàng:</p>
                    <p class="delivery-item__content">
                      {{ order.createdAt | formatDate() }}
                    </p>
                  </div>
                  <div class="delivery-item">
                    <p class="delivery-item__title">Ngày lấy hàng:</p>
                    <p
                      class="delivery-item__content"
                      v-if="getShippingDeliveryDate"
                    >
                      {{ getShippingDeliveryDate | formatDate() }}
                    </p>
                    <p class="delivery-item__content" v-else>
                      <span class="p-tag p-tag-danger">
                        {{ notConfirm }}
                      </span>
                    </p>
                  </div>
                  <div class="delivery-item">
                    <p class="delivery-item__title">Ngày giao hàng:</p>
                    <p
                      class="delivery-item__content"
                      v-if="getShippingReceiptDate"
                    >
                      {{ getShippingReceiptDate | formatDate() }}
                    </p>
                    <p class="delivery-item__content" v-else>
                      <span class="p-tag p-tag-danger">
                        {{ notConfirm }}
                      </span>
                    </p>
                  </div>
                  <div class="delivery-item">
                    <p class="delivery-item__title">Thông tin người nhận:</p>
                    <p class="delivery-item__content" v-if="getInfoReceiver">
                      {{ getInfoReceiver }}
                    </p>
                    <p class="delivery-item__content" v-else>
                      <span class="p-tag p-tag-danger">
                        {{ notConfirm }}
                      </span>
                    </p>
                  </div>

                  <div class="delivery-item">
                    <p class="delivery-item__title">Thông tin vận chuyển:</p>
                    <template v-if="checkShipping">
                      <p class="delivery-item__content">
                        <span>Đơn vị vận chuyển: </span>
                        <span class="p-pl-3">
                          {{ getCarrierName }}
                        </span>
                      </p>
                      <p class="delivery-item__content">
                        <span>Mã đơn vị: </span>
                        <span class="p-pl-3">{{ getCarrierCode }}</span>
                      </p>
                      <p class="delivery-item__content">
                        <span>Phí shipping: </span>
                        <span class="p-pl-3">{{
                          getShippingPrice | formatMoney()
                        }}</span>
                      </p>
                      <p class="delivery-item__content">
                        <span>Thu hộ </span>:
                        <span class="p-pl-3">{{
                          getShippingPriceCode | formatMoney()
                        }}</span>
                      </p>
                      <p class="delivery-item__content">
                        <span>Đặt cọc </span>:
                        <span class="p-pl-3">{{
                          getShippingDepositPrice | formatMoney()
                        }}</span>
                      </p>
                      <p class="delivery-item__content">
                        <span>Kích thước gói hàng </span>:
                        <span class="p-pl-3">{{ getShippingSize }}</span>
                      </p>
                      <p class="delivery-item__content">
                        <span>Trọng lượng gói hàng </span>:
                        <span class="p-pl-3">{{ getShippingWeight }} g</span>
                      </p>
                      <p class="delivery-item__content">
                        <span>Ghi chú </span>:
                        <span class="p-pl-3">{{ getShippingNote }}</span>
                      </p>
                    </template>
                    <template v-else>
                      <p class="delivery-item__content">
                        <span class="p-tag p-tag-danger">
                          {{ notConfirm }}
                        </span>
                      </p>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getJSONStorageReader } from "@/helpers/local-storage.js";
import resources from "@/constants/resources";

import TrackingOrder from "@/components/TrackingOrder.vue";

const pageCurrentLocal = getJSONStorageReader("pageCurrent");

export default {
  components: {
    TrackingOrder,
  },

  data() {
    return {
      pageCurrent: pageCurrentLocal.get() || null,
      avatarDefault: resources.avatarDefault,
      loader: null,
      loadingSetting: {
        width: 64,
        height: 64,
        opacity: 1,
        loader: "spinner",
        color: "#56A3ED",
      },
      notConfirm: "Chưa chốt đơn",
    };
  },

  async mounted() {
    const { id } = this.$route.params;
    await this.getOrder({ id });
    if (!this.order) {
      window.location.href = "/notfound";
    }
  },

  beforeDestroy() {
    this.$store.commit("order/setOrder", null);
  },

  watch: {
    isLoading(value) {
      if (value) {
        this.loader = this.$loading.show({ ...this.loadingSetting });
      } else {
        this.loader.hide();
      }
    },
  },

  computed: {
    ...mapState({
      order: (state) => state.order.order,
      statusUpdate: (state) => state.order.status.update,
      isLoading: (state) => state.order.isLoading,
    }),

    checkShipping() {
      return (
        this.order.shippingInformation && this.order.shippingInformation.length
      );
    },

    getInfoReceiver() {
      if (this.checkShipping) {
        let info = this.order.shippingInformation[0];
        return `${info.receiver} - ${info.phone} - ${info.address}`;
      }
      return "";
    },

    getShippingAddress() {
      if (this.checkShipping) {
        return this.order.shippingInformation[0].address;
      }

      return "";
    },

    getShippingDeliveryDate() {
      if (this.checkShipping) {
        return this.order.shippingInformation[0].deliveryDate;
      }

      return "";
    },

    getShippingReceiptDate() {
      if (this.checkShipping) {
        return this.order.shippingInformation[0].receiptDate;
      }

      return "";
    },

    getShippingPriceCode() {
      if (this.checkShipping) {
        return this.order.shippingInformation[0].codPrice;
      }

      return 0;
    },

    getShippingPrice() {
      if (this.checkShipping) {
        return this.order.shippingInformation[0].shippingPrice;
      }

      return 0;
    },

    getShippingDepositPrice() {
      if (this.checkShipping) {
        return this.order.shippingInformation[0].depositPrice;
      }

      return 0;
    },

    getShippingSize() {
      if (this.checkShipping) {
        return this.order.shippingInformation[0].size;
      }

      return 0;
    },

    getShippingWeight() {
      if (this.checkShipping) {
        return this.order.shippingInformation[0].weight;
      }

      return 0;
    },

    getShippingNote() {
      if (this.checkShipping) {
        return this.order.shippingInformation[0].note;
      }

      return "";
    },

    getCarrierName() {
      if (this.order.carrier) {
        return this.order.carrier.name;
      }

      return "";
    },

    getCarrierCode() {
      if (this.order.carrier) {
        return this.order.carrier.code;
      }

      return "";
    },
  },

  methods: {
    ...mapActions({
      getOrder: "order/fetchById",
      updateOrder: "order/update",
    }),

    goBack() {
      let redirectURL = "/orders";
      const { redirect } = this.$route.query;
      if (redirect) redirectURL = redirect;

      this.$router.push(redirectURL);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/order-detail";
</style>
