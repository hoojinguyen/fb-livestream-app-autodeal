import { trimString, createStringRandom, isPhoneNumber } from "@/utils";

export default {
  methods: {
    formatSku(sku) {
      return trimString(sku.toUpperCase());
    },

    checkSku(sku) {
      let variant = null;
      const { variants } = this.productGroup;
      for (const item of variants) {
        let check = this.formatSku(item.sku) == this.formatSku(sku);
        if (check) {
          variant = item;
          break;
        }
      }
      return variant;
    },

    async checkRegex({ message, sender }) {
      const sku = "MÃ HÀNG HOÁ";
      const stock = "SỐ LƯỢNG";
      const phone = "SĐT";
      const { syntax } = this;

      let flag = true;
      let orderTemp = { sku: "", stock: "", phone: "" };
      const comment = trimString(message).split(" ");

      if (comment.length == syntax.length) {
        for (let i = 0; i < syntax.length; i++) {
          let syntaxString = syntax[i].toUpperCase();
          if (syntaxString == sku) {
            let hasSKU = this.checkSku(comment[i]);
            if (!hasSKU) {
              flag = false;
              return this.showToast({ severity: "error", type: "sku" });
            } else {
              orderTemp.sku = comment[i];
              orderTemp.variant = hasSKU;
            }
          } else if (syntaxString == stock) {
            const num = Number(comment[i]);
            const checkNum = Number.isInteger(num);
            if (!checkNum || num > 10) {
              flag = false;
              return this.showToast({ severity: "error", type: "stock" });
            } else {
              orderTemp.stock = comment[i];
            }
          } else if (syntaxString == phone) {
            if (!isPhoneNumber(comment[i])) {
              flag = false;
              return this.showToast({ severity: "error", type: "phone" });
            } else {
              orderTemp.phone = comment[i];
            }
          }
        }
        if (flag) {
          // const payload = { order: orderTemp, customer: sender };
          await this.cleanAndCreateOrder(orderTemp, sender);
        }
      } else {
        return this.showToast({ severity: "error", type: "syntax" });
      }
    },

    async cleanAndCreateOrder(order, sender) {
      // Check customer
      let customerId = null;
      let customer = await this.getCustomerByFbId({ id: sender.id });
      if (customer && customer.status) {
        customerId = customer.data.id;
      } else {
        customer = await this.createCustomer({
          email: sender.email,
          name: sender.name,
          facebookUserId: sender.id,
          phone: order.phone || null,
        });
        if (customer && customer.status) {
          customerId = customer.data.id;
        }
      }

      // Check coupon
      let couponId = null;
      if (order.coupon) {
        let coupon = await this.createCoupon(order.coupon);
        if (coupon && coupon.status) {
          couponId = coupon.data.id;
        }
      }

      // Format data
      let facebookLivestreamId = this.$route.params.id;
      // let facebookAccessToken = null;
      // if (this.pageCurrent) {
      //   facebookAccessToken = this.pageCurrent.accessToken;
      // }
      let params = {
        customerId,
        couponId,
        code: createStringRandom("OrderLive"),
        // facebookAccessToken,
        facebookLivestreamId,
        facebookUserId: sender.id || null,
        facebookPageId: this.pageCurrent.id || null,
        details: [
          {
            variantId: order.variant.id,
            price: order.variant.sellPrice,
            quantity: order.stock || 0,
            total: order.stock * order.variant.sellPrice,
            subtotal: order.stock * order.variant.sellPrice,
            source: "livestream",
            code: createStringRandom("DetailLive"),
          },
        ],
      };

      // Tao order
      const result = await this.createOrder(params);
      if (result && result.status) {
        await this.getOrders({ id: facebookLivestreamId });
        await this.showToast({ severity: "success", name: sender.name });
      } else {
        if (result.error.message == "status invalid") {
          this.showToast({ severity: "error", type: "status" });
        } else if (result.error.message == "sold out") {
          this.showToast({ severity: "error", type: "stock" });
        } else {
          this.showToast({ severity: "error", type: "syntax" });
        }
      }
    },
  },
};
