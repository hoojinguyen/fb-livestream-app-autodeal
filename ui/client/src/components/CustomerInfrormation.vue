<template>
  <div class="sale-information vld-parent" ref="messageInformation">
    <template v-if="profile">
      <!-- Dialog Xoa Danh sach don hang -->
      <Dialog
        :visible.sync="isOpenBlock"
        :style="{ width: '450px' }"
        :header="titleBlockCustomer"
      >
        <!-- <div class="confirmation-content"> -->
        <div class="p-fluid p-grid">
          <div class="p-field p-col-12">
            <Textarea
              v-model="reasonBlock"
              rows="5"
              cols="50"
              placeholder="Nhập lý do chặn"
            />
          </div>
        </div>
        <!-- </div> -->
        <template #footer>
          <Button
            label="Huỷ bỏ"
            icon="pi pi-times"
            class="p-button-text"
            @click="closeBlockDialog()"
          />
          <Button label="Đồng ý" icon="pi pi-check" @click="confirmBlock()">
          </Button>
        </template>
      </Dialog>
      <!-- Dialog Xoa 1 san pham -->
      <div class="sale-information__header">
        <div class="customer-information">
          <div class="customer-information__avatar">
            <div class="p-pt-4">
              <img :src="profile.avatar" alt="avatar" />
            </div>
          </div>
          <div class="customer-information__title">
            <div class="customer-information__title__name">
              <span v-if="customer">{{ customer.name }}</span>
              <span v-else>{{ profile.name }}</span>
            </div>
            <div class="customer-information__title__subtext">
              <i class="pi pi-fw pi-mobile"></i>
              <span class="p-pl-2" v-if="customer && customer.phone">
                {{ customer.phone }}
              </span>
              <span class="p-pl-2" v-else>{{ titleNotUpdate }}</span>
            </div>
            <div class="customer-information__title__subtext">
              <i class="pi pi-fw pi-map-marker"></i>
              <span class="p-pl-2" v-if="customer && customer.address">
                {{ customer.address }}
              </span>
              <span class="p-pl-2" v-else>{{ titleNotUpdate }}</span>
            </div>
          </div>
          <div class="customer-information__actions">
            <template v-if="customer">
              <Button
                type="button"
                class="p-button-rounded p-button-warning p-mr-1"
                icon="pi pi-cog"
                v-tooltip.left="'Cập nhật thông tin khách hàng'"
                @click="openFormUpdate()"
              />

              <Button
                type="button"
                class="p-button-rounded p-button-danger p-mr-1"
                icon="pi pi-ban"
                v-tooltip.left="'Chặn khách hàng'"
                @click="openBlockDialog()"
              />
            </template>
          </div>
        </div>
      </div>
      <div class="sale-information__body">
        <div class="sale-tab">
          <TabView>
            <TabPanel header="Ghi chú">
              <div class="sale-tab__note">
                <input
                  class="sale-tab__note__input"
                  type="text"
                  placeholder="Nhập ghi chú và nhấn Enter"
                  v-model="textNote"
                  @keyup.enter="addNote()"
                />
                <div class="sale-tab__note__list vld-parent" ref="noteList">
                  <template v-if="notes.length">
                    <div
                      class="note-wrapper"
                      v-for="note in notes"
                      :key="note.id"
                    >
                      <span class="note-wrapper__content">{{
                        note.details
                      }}</span>
                      <span
                        class="note-wrapper__remove"
                        @click="removeNote(note)"
                      >
                        <i class="pi pi-fw pi-trash"></i>
                      </span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="note-empty">
                      <img
                        width="80px"
                        src="assets/layout/images/misa/ic_note_empty.png"
                      />
                      <p>Không có ghi chú nào</p>
                    </div>
                  </template>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Lịch sử mua hàng">
              <div class="sale-tab__order vld-parent" ref="orderList">
                <template v-if="orders.length">
                  <div
                    class="order-history"
                    v-for="ord in orders"
                    :key="ord.id"
                  >
                    <div class="order-history__left">
                      <p class="order-name">{{ ord.code }}</p>
                      <p class="order-time">
                        {{ ord.createdAt | formatDateAndTime() }}
                      </p>
                    </div>
                    <div class="order-history__right">
                      <p class="order-price">
                        {{ ord.total | formatMoney() }}
                      </p>
                      <p class="order-status">
                        {{ ord.status | formatStatus() }}
                      </p>
                      <Button
                        label="Xem chi tiết"
                        icon="pi pi-angle-double-right"
                        iconPos="right"
                        class="p-button-text p-pr-0"
                        @click="openDetailOrder(ord)"
                      />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div>
                    <img
                      width="156px"
                      src="assets/layout/images/misa/ic_Khong_Don_Hang0.svg"
                    />
                    <p class="p-mt-2">CHƯA CÓ ĐƠN HÀNG</p>
                  </div>
                </template>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
      <div class="sale-information__footer">
        <Button
          label="Tạo đơn hàng"
          icon="pi pi-shopping-cart"
          @click="openFormCreateOrder()"
        />
      </div>
    </template>
    <template v-else>
      <div class="sale-information__yet">
        <div class="sale-information__yet__center">
          <img
            width="156px"
            src="assets/layout/images/misa/ic_Khong_Don_Hang0.svg"
          />
          <p class="p-mt-2">KHÔNG CÓ ĐƠN HÀNG</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { deepClone } from "@/utils";
export default {
  props: {
    loading: { type: Boolean, default: false },
    loadingOrder: { type: Boolean, default: false },
    loadingNote: { type: Boolean, default: false },
    customer: { type: Object, default: null },
    profile: { type: Object, default: null },
    notes: { type: Array, default: () => [] },
    orders: { type: Array, default: () => [] },
  },

  data() {
    return {
      textNote: "",
      titleNotUpdate: "Chưa có thông tin",
      loader: null,
      loaderNote: null,
      loaderOrder: null,
      loadingConfig: {
        width: 54,
        height: 54,
        opacity: 1,
        loader: "spinner",
        color: "#56A3ED",
      },
      isOpenBlock: false,
      customerBlock: null,
      titleBlockCustomer: "",
      reasonBlock: "",
    };
  },

  watch: {
    loading(value) {
      if (value) {
        this.loader = this.$loading.show({
          ...this.loadingConfig,
          container: this.$refs.messageInformation,
        });
      } else {
        this.loader.hide();
      }
    },
    loadingOrder(value) {
      if (value) {
        this.loaderOrder = this.$loading.show({
          ...this.loadingConfig,
          container: this.$refs.orderList,
        });
      } else {
        if (this.loaderOrder) {
          this.loaderOrder.hide();
        }
      }
    },
    loadingNote(value) {
      if (value) {
        this.loaderNote = this.$loading.show({
          ...this.loadingConfig,
          container: this.$refs.noteList,
        });
      } else {
        if (this.loaderNote) {
          this.loaderNote.hide();
        }
      }
    },

    isOpenBlock(value) {
      if (!value) {
        this.customerBlock = null;
      }
    },
  },

  methods: {
    openFormUpdate() {
      this.$emit("openForm", "update-information");
    },

    openFormCreateOrder() {
      this.$emit("openForm", "create-order");
    },

    openDetailOrder(order) {
      const redirect = "/sale";
      this.$router.push(`/order/detail/${order.id}?redirect=${redirect}`);
    },

    addNote() {
      if (this.textNote) {
        const content = this.textNote;
        this.textNote = "";
        this.$emit("create", content);
      }
    },

    removeNote(note) {
      this.$emit("remove", note);
    },

    checkArray(value) {
      return (
        this.customer && this.customer[value] && this.customer[value].length
      );
    },

    openBlockDialog() {
      this.customerBlock = deepClone(this.customer);
      this.titleBlockCustomer = `Chặn khách hàng ${this.customer.name} `;
      this.isOpenBlock = true;
    },

    closeBlockDialog() {
      this.customerBlock = null;
      this.titleBlockCustomer = "";
      this.reasonBlock = "";
      this.isOpenBlock = false;
    },

    async confirmBlock() {
      await this.$store.dispatch("customer/blockCustomer", {
        reason: this.reasonBlock,
        customerId: this.customerBlock.id,
      });
      await this.closeBlockDialog();
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/message-information";
</style>
