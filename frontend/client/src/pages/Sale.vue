<template>
  <div class="sale-page">
    <Toast style="text-align: left" />
    <div class="sp-w25 sp-br">
      <ListConversation
        :loading="loadingListConversations"
        :conversations="listConversations"
        @choosen="getConversation"
      />
    </div>
    <div class="sp-br" :class="isOpenForm ? 'sp-w30' : 'sp-w50'">
      <Conversation
        :conversation="conversation"
        :loading="loadingConversation"
        :isConnected="isConnectedMessage"
        @send="sendMessage"
        @connect="connectChatMessage"
      />
    </div>
    <div class="sp-w25" :class="isOpenForm ? 'sp-w45' : 'sp-w25'">
      <template
        v-if="
          !isOpenFormUpdateInfo &&
            !isOpenFormCreateOrder &&
            !isOpenFormConfirmOrder
        "
      >
        <CustomerInfrormation
          :profile="profile"
          :customer="customer"
          :notes="notes"
          :orders="orders"
          :loading="loadingCustomer"
          :loadingOrder="loadingOrder"
          :loadingNote="loadingNote"
          @openForm="openForm"
          @create="createNewNote"
          @remove="removeNote"
        />
      </template>
      <template v-if="isOpenFormUpdateInfo">
        <FormUpdateInformation
          :customer="customer"
          :loading="loading.updateInformation"
          @backTo="backTo"
          @update="updateInformation"
        />
      </template>
      <template v-if="isOpenFormCreateOrder">
        <FormCreateOrder
          :customer="customer"
          :loadingNext="loading.createOrder"
          :loadingSave="loading.saveOrderTemporary"
          :loadingCancel="loading.cancelOrder"
          :variants="variants"
          @backTo="backTo"
          @create-and-next="createOrderAndNext"
          @create-and-back="createOrderTempAndBack"
          @cancel="closeAllForm"
        />
      </template>
      <template v-show="isOpenFormConfirmOrder">
        <FormConfirmOrder
          :order="order"
          :customer="customer"
          :carriers="carriers"
          :loadingFinish="loading.confirmOrder"
          :loadingSave="loading.saveOrderTemporary"
          :loadingCancel="loading.cancelOrder"
          @backTo="backTo"
          @createCarrier="createCarrier"
          @confirm="confirmOrderAndDelivery"
          @cancel="cancelOrder"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getJSONStorageReader } from "@/helpers/local-storage.js";
import { createStringRandom } from "@/utils";

import ListConversation from "@/components/ListConversation.vue";
import Conversation from "@/components/Conversation.vue";
import CustomerInfrormation from "@/components/CustomerInfrormation.vue";

import FormCreateOrder from "@/components/FormCreateOrder.vue";
import FormConfirmOrder from "@/components/FormConfirmOrder.vue";
import FormUpdateInformation from "@/components/FormUpdateInformation.vue";

const pageCurrentLocal = getJSONStorageReader("pageCurrent");

export default {
  components: {
    Conversation,
    ListConversation,
    CustomerInfrormation,
    FormCreateOrder,
    FormConfirmOrder,
    FormUpdateInformation,
  },

  data() {
    return {
      profile: null,
      pageCurrent: pageCurrentLocal.get(),
      isOpenForm: false,
      isOpenFormUpdateInfo: false,
      isOpenFormCreateOrder: false,
      isOpenFormConfirmOrder: false,
      loading: {
        updateInformation: false,
        createOrder: false,
        saveOrderTemporary: false,
        cancelOrder: false,
        confirmOrder: false,
      },
      pollMessage: null,
      pollEndTime: 240000,
      pollBetweenTime: 3000,
      pollCount: 0,
      isConnectedMessage: false,
    };
  },

  mounted() {
    if (this.pageCurrent) {
      const { dispatch } = this.$store;
      dispatch("variant/fetchAll");
      dispatch("facebook/getConversations", {
        pageId: this.pageCurrent.id,
        accessToken: this.pageCurrent.accessToken,
      });
    }
  },

  beforeDestroy() {
    this.resetAll();
  },

  computed: {
    ...mapState({
      loadingCustomer: (state) => state.customer.isLoading,
      loadingNote: (state) => state.note.isLoading,
      loadingOrder: (state) => state.order.isLoading,
      loadingListConversations: (state) =>
        state.facebook.loadingListConversations,
      loadingConversation: (state) => state.facebook.loadingConversation,
      listConversations: (state) => state.facebook.listConversations,
      hasNewMessage: (state) => state.facebook.hasNewMessage,
      conversation: (state) => state.facebook.conversation,
      customer: (state) => state.customer.customer,
      variants: (state) => state.variant.variants,
      notes: (state) => state.note.notes,
      orders: (state) => state.order.orders,
      order: (state) => state.order.order,
      carriers: (state) => state.carrier.carriers,
      coupon: (state) => state.coupon.coupon,
    }),

    ...mapGetters({
      messages: "facebook/messages",
      userChat: "facebook/userChat",
    }),
  },

  watch: {
    pollCount(value) {
      if (value >= this.pollEndTime) {
        this.stopPoll();
        this.setConnected(false);
      }
    },
    hasNewMessage(value) {
      if (value) {
        this.showToast("success", "newMessage");
        this.$store.commit("facebook/setHasNewMessage", false);
      }
    },
  },

  methods: {
    async createNewNote(note) {
      const { dispatch } = this.$store;

      if (this.customer) {
        dispatch("note/create", {
          customerId: this.customer.id,
          details: note,
        });
      } else {
        await dispatch("customer/create", {
          email: this.profile.email,
          name: this.profile.name,
          facebookUserId: this.profile.id,
        });
        if (this.customer) {
          await dispatch("note/create", {
            customerId: this.customer.id,
            details: note,
          });
        }
      }
    },

    async removeNote(note) {
      const { dispatch } = this.$store;
      await dispatch("note/delete", { ids: [note.id] });
    },

    async updateInformation(info) {
      await this.setLoading("updateInformation", true);
      await this.$store.dispatch("customer/update", info);
      await this.setLoading("updateInformation", false);
      await this.showToast("success", "update");
      this.isOpenFormUpdateInfo = false;
    },

    async formatDataOrder(order) {
      let couponId = null;
      if (order.coupon) {
        await this.$store.dispatch("coupon/create", order.coupon);
        couponId = this.coupon.id;
      }

      return {
        customerId: this.customer.id,
        couponId,
        code: createStringRandom("OrderSale"),
        facebookPageId: this.pageCurrent.id,
        facebookUserId: this.profile.id,
        details: order.details.map((el) => {
          return {
            variantId: el.variantId,
            price: el.price,
            quantity: el.quantity,
            total: el.total,
            subtotal: el.subtotal,
            source: "messenger",
            code: createStringRandom("DetailSale"),
          };
        }),
      };
    },

    async createOrderAndNext(order) {
      let dataFormat = null;
      const { dispatch } = this.$store;

      await this.setLoading("createOrder", true);
      if (this.customer) {
        dataFormat = await this.formatDataOrder(order);
        await dispatch("order/create", dataFormat);
      } else {
        await dispatch("customer/create", {
          email: this.profile.email,
          name: this.profile.name,
          facebookUserId: this.profile.id,
        });
        if (this.customer) {
          dataFormat = await this.formatDataOrder(order);
          await dispatch("order/create", dataFormat);
        }
      }
      await this.setLoading("createOrder", false);

      await dispatch("carrier/fetchAll");

      this.isOpenFormCreateOrder = false;
      this.isOpenFormConfirmOrder = true;
    },

    async createOrderTempAndBack(order) {
      let dataFormat = null;
      const { dispatch } = this.$store;

      await this.setLoading("saveOrderTemporary", true);
      if (this.customer) {
        dataFormat = await this.formatDataOrder(order);
        await dispatch("order/create", dataFormat);
      } else {
        await dispatch("customer/create", {
          email: this.profile.email,
          name: this.profile.name,
          facebookUserId: this.profile.id,
        });
        if (this.customer) {
          dataFormat = await this.formatDataOrder(order);
          await dispatch("order/create", dataFormat);
          await dispatch("order/fetchAllByCustomerId", {
            customerId: this.customer.id,
          });
        }
      }

      await this.setLoading("saveOrderTemporary", false);
      await this.showToast("success", "create");

      this.isOpenForm = false;
      this.isOpenFormCreateOrder = false;
    },

    async confirmOrderAndDelivery(shipping) {
      const { dispatch } = this.$store;

      await this.setLoading("confirmOrder", true);

      // Status = 1, Chot don
      await dispatch("order/update", { status: 2, order: shipping.order });
      // Status = 2, Xac nhan thong tin
      await dispatch("order/update", shipping);

      if (this.customer) {
        await dispatch("order/fetchAllByCustomerId", {
          customerId: this.customer.id,
        });
      }

      await this.setLoading("confirmOrder", false);
      await this.showToast("success", "create");

      this.isOpenForm = false;
      this.isOpenFormConfirmOrder = false;
    },

    async cancelOrder(order) {
      const { dispatch } = this.$store;

      await this.setLoading("cancelOrder", true);

      await dispatch("order/update", order);

      if (this.customer) {
        const customerId = this.customer.id;
        dispatch("order/fetchAllByCustomerId", { customerId });
      }

      await this.setLoading("cancelOrder", false);
      await this.showToast("success", "cancel");

      await this.closeAllForm();
    },

    async createCarrier(carrier) {
      const { dispatch } = this.$store;
      await dispatch("carrier/create", carrier);
    },

    async connectChatMessage(connected) {
      if (!connected) {
        await this.stopPoll();
        await this.setConnected(true);
        await this.pollMessageWithSetInterval();
      } else {
        await this.stopPoll();
        await this.setConnected(false);
      }
    },

    async sendMessage({ text, file }) {
      const payload = {
        messagingType: "",
        recipientId: this.profile.id,
        accessToken: this.pageCurrent.accessToken,
        message: { text },
      };
      const { dispatch } = this.$store;

      if (file) {
        const image = await dispatch("upload/uploadSingleFile", {
          fileAttach: file,
          folder: "facebook",
        });
        payload.message.image = image;
      }

      await dispatch("facebook/sendMessage", payload);
      await dispatch("facebook/getMessage", {
        conversationId: this.conversation.id,
        accessToken: this.pageCurrent.accessToken,
        limit: 1,
      });

      await this.stopPoll();
      await this.setConnected(true);
      await this.pollMessageWithSetInterval();
    },

    pollMessageWithSetInterval() {
      this.pollMessages = setInterval(() => {
        if (this.pollMessages) {
          this.$store.dispatch("facebook/getMessage", {
            conversationId: this.conversation.id,
            accessToken: this.pageCurrent.accessToken,
            limit: 1,
          });
          this.pollCount += this.pollBetweenTime;
        }
      }, this.pollBetweenTime);
    },

    async getConversation(conv) {
      await Promise.all([this.closeAllForm(), this.resetAll()]);

      const { dispatch } = this.$store;
      //  profile in facebook
      this.profile = {
        ...conv.sender,
        accessToken: conv.accessToken,
      };

      await dispatch("customer/fetchByFacebookId", { id: conv.sender.id });
      if (this.customer) {
        const customerId = this.customer.id;
        dispatch("note/fetchAllByCustomerId", { customerId });
        dispatch("order/fetchAllByCustomerId", { customerId });
      }

      dispatch("facebook/getMessages", {
        accessToken: this.pageCurrent.accessToken,
        conversationId: conv.id,
      });
    },

    stopPoll() {
      if (this.pollMessages) {
        clearInterval(this.pollMessages);
        this.pollMessages = null;
        this.pollCount = 0;
      }
    },

    resetAll() {
      const { commit } = this.$store;
      this.stopPoll();
      this.setConnected(false);
      commit("facebook/setConversation", null);
      commit("customer/setCustomer", null);
      commit("note/setNotes", []);
      commit("order/setOrders", []);
      commit("order/setOrder", null);
    },

    setConnected(value) {
      this.isConnectedMessage = value;
    },

    setLoading(type, value) {
      this.loading[type] = value;
    },

    openForm(form) {
      if (form == "update-information") {
        this.isOpenFormUpdateInfo = true;
      } else if (form == "create-order") {
        this.isOpenFormCreateOrder = true;
        this.isOpenForm = true;
      }
    },

    closeAllForm() {
      this.isOpenForm = false;
      this.isOpenFormUpdateInfo = false;
      this.isOpenFormCreateOrder = false;
      this.isOpenFormConfirmOrder = false;
    },

    backTo(form) {
      if (form == "update-information") {
        this.isOpenFormUpdateInfo = false;
      } else if (form == "create-order") {
        this.isOpenFormCreateOrder = false;
        this.isOpenForm = false;
      } else if (form == "confirm-order") {
        this.isOpenFormConfirmOrder = false;
        this.isOpenForm = false;
      }
    },

    showToast(severity, action) {
      if (action == "newMessage") {
        this.$toast.add({
          severity,
          summary: "Tin nhắn",
          detail: "Bạn nhận được tin nhắn mới !",
          life: 3000,
        });
        return;
      }

      let detail = "";
      let summary = severity == "error" ? "Thất bại" : "Thành công";

      if (action == "create") detail = "Tạo mới";
      else if (action == "update") detail = "Cập nhật";
      else if (action == "cancel") detail = "Huỷ";
      else detail = "Xoá";

      this.$toast.add({
        severity,
        summary,
        detail: `${detail} ${summary}`,
        life: 3000,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/sale";
</style>
