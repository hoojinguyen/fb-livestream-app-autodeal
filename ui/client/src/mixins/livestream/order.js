import { createStringRandom } from "@/utils";

export default {
  data() {
    return {
      orderCurrent: null,
      isLoadingPopUpOrder: false,
      isOpenPopUpCreateOrder: false,
      isOpenPopUpConfirm: false,
      isOpenPopUpDelete: false,
      isLoadingOrder: false,
      isUpdatePopUp: false,
      selectedOrders: [],
      filterOrders: {},
      orderDeleteCurrent: null,
      contentDelete: "",
    };
  },

  methods: {
    async createOrderWithPopUp({ customer, quantity, variant }) {
      let customerId = null;
      let facebookUserId = null;
      if (customer.phone) {
        let resCustomer = await this.getCustomerByPhone({
          phone: customer.phone,
        });
        if (resCustomer && resCustomer.status) {
          customerId = resCustomer.data.id;
          facebookUserId = resCustomer.data.facebookUserId || null;
        } else {
          resCustomer = await this.createCustomer({
            email: customer.email,
            name: customer.name,
            facebookUserId: null,
            phone: customer.phone,
          });
          if (resCustomer && resCustomer.status) {
            customerId = resCustomer.data.id;
          }
        }
      }

      let facebookLivestreamId = this.$route.params.id;
      let facebookAccessToken = null;
      if (this.pageCurrent) {
        facebookAccessToken = this.pageCurrent.accessToken;
      }
      let params = {
        customerId,
        couponId: null,
        code: createStringRandom("OrderLive"),
        facebookAccessToken,
        facebookLivestreamId,
        facebookUserId: facebookUserId,
        facebookPageId: this.pageCurrent.id || null,
        details: [
          {
            variantId: variant.id,
            price: variant.sellPrice,
            quantity: quantity,
            total: Number(quantity) * Number(variant.sellPrice),
            subtotal: Number(quantity) * Number(variant.sellPrice),
            source: "livestream",
            code: createStringRandom("DetailLive"),
          },
        ],
      };

      // Tao order
      const result = await this.createOrder(params);
      if (result && result.status) {
        await this.getOrders({ id: facebookLivestreamId });
        await this.showToast({ severity: "success", name: customer.name });
      } else {
        if (result.error.message == "status invalid") {
          this.showToast({ severity: "error", type: "status" });
        } else if (status.error.message == "sold out") {
          this.showToast({ severity: "error", type: "stock" });
        } else {
          this.showToast({ severity: "error", type: "syntax" });
        }
      }

      await this.closePopUpCreateOrder();
    },

    async confirmShipping(args) {
      await this.setLoadingOrderTable(true);
      await this.setLoadingWithPopup(true);

      if (args.status == 1) {
        await this.updateOrder({
          status: 2,
          order: args.order,
        });
      }

      await this.updateOrder({
        status: 3,
        order: args.order,
        shippingInformation: args.shippingInformation,
      });

      await this.getOrders({ id: this.$route.params.id });
      await this.showToast({
        severity: "success",
        custom: {
          title: "Chốt đơn thành công",
          description: `Mã đơn: ${args.order.code}`,
        },
      });
      await this.closePopUpConfirm();
      await this.setLoadingOrderTable(false);
      await this.setLoadingWithPopup(false);
    },

    async updateShipping(args) {
      await this.setLoadingOrderTable(true);

      await this.updateShippingInOrder(args.shipping);
      if (!args.deleteOrder) {
        await this.getOrders({ id: this.$route.params.id });
        await this.showToast({
          severity: "success",
          custom: {
            title: "Cập nhật thông tin giao hàng thành công",
            description: `Mã đơn: ${this.orderCurrent.code}`,
          },
        });
      }

      await this.closePopUpConfirm();
      if (args.deleteOrder) {
        await this.openPopUpDelete(args.deleteOrder);
      }

      await this.setLoadingOrderTable(false);
    },

    async confirmDeleteDetails() {
      await this.setLoadingOrderTable(true);

      let { all, orderId, status, ids } = this.orderDeleteCurrent;
      await this.deleteDetails({ ids, orderId, status });
      if (all) {
        await this.deleteOrder({ ids: [orderId] });
      }
      await this.getOrders({ id: this.$route.params.id });
      await this.closePopUpDelete();
      await this.setLoadingOrderTable(false);
    },

    openPopUpCreateOrder() {
      this.submitted = false;
      this.orderCurrent = null;
      this.isOpenPopUpCreateOrder = true;
    },

    closePopUpCreateOrder() {
      this.submitted = false;
      this.orderCurrent = null;
      this.isOpenPopUpCreateOrder = false;
    },

    openPopUpConfirm(order) {
      this.isUpdatePopUp = false;
      this.isOpenPopUpConfirm = true;
      this.orderCurrent = order;
    },

    openPopUpUpdate(order) {
      this.isUpdatePopUp = true;
      this.isOpenPopUpConfirm = true;
      this.orderCurrent = order;
    },

    closePopUpConfirm() {
      this.isUpdatePopUp = false;
      this.isOpenPopUpConfirm = false;
      this.orderCurrent = null;
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

    setLoadingWithPopup(value) {
      this.isLoadingPopUpOrder = value;
    },

    setLoadingOrderTable(value) {
      this.isLoadingOrder = value;
    },
  },
};
