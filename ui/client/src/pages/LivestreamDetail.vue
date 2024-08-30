<template>
  <div class="ls-detail" @click="closeMenuOption">
    <Toast style="text-align:left" position="bottom-right" />

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
        />
      </template>
    </Dialog>

    <PopUpChat
      :visible="isOpenPopUpChat"
      :conversation="conversation"
      @send="sendMessage"
      @close="isOpenPopUpChat = false"
    />

    <PopUpCreateOrder
      title="Tạo mới đơn hàng"
      :visible="isOpenPopUpCreateOrder"
      :products="producstSearch"
      :loading="isLoadingPopUpOrder"
      @create="createOrderWithPopUp"
      @close="closePopUpCreateOrder"
    />

    <PopUpConfirmShipping
      :visible="isOpenPopUpConfirm"
      :order="orderCurrent"
      :loading="isLoadingPopUpOrder"
      :carriers="carriers"
      :isUpdate="isUpdatePopUp"
      :showListDetail="isUpdatePopUp"
      @confirm="confirmShipping"
      @update="updateShipping"
      @close="closePopUpConfirm"
    />

    <div ref="menuOption">
      <ul
        id="right-click-menu-option"
        tabindex="-1"
        v-if="isOpenMenuOption"
        :style="{ top: topMenuOption, left: leftMenuOption }"
      >
        <li @click="menuCreateOrder">
          <span> <i class="pi pi-plus"></i> </span>
          <span>Tạo đơn</span>
        </li>
        <li @click="menuCopyComment">
          <span><i class="pi pi-copy"></i> </span>
          <span>Sao chép bình luận</span>
        </li>
        <li @click="menuCopyPhone">
          <span> <i class="pi pi-mobile"></i> </span>
          <span>Sao chép SĐT</span>
        </li>
      </ul>
    </div>

    <Sidebar
      :visible.sync="isOpenLogActivity"
      position="right"
      style="z-index: 999999"
    >
      <h3>Hoạt động gần đây</h3>
      <div class="side-bar-log-container">
        <template v-if="logs.length">
          <div class="side-bar-log">
            <div
              class="log-item"
              v-for="(log, logIndex) in logs"
              :key="logIndex"
            >
              <span class="log-item__time">{{ log.createdAt }}</span>
              <span class="log-item__title">{{ log.title || "" }}</span>
              <span class="log-item__description">
                {{ log.description || "" }}</span
              >
            </div>
          </div>
        </template>
        <template v-else>
          <div class="side-bar-log-empty">
            <span>Không có hoạt động nào gần đây ...</span>
          </div>
        </template>
      </div>
    </Sidebar>

    <div class="ls-detail__header">
      <div class="ls-detail__header__back">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-lg"
          @click="goBack()"
        />
      </div>
      <div class="ls-detail__header__information">
        <div class="ls-header-info-setting">
          <span class="syntax-title">Cú pháp: </span>
          <span class="syntax-format">
            <span v-for="(syn, index) in formatSyntax(syntax)" :key="index">
              <template v-if="syn == 'syntax'">
                <span class="syntax-badge-space">Dấu cách</span>
              </template>
              <template v-else>
                <span class="syntax-text">{{ syn }}</span>
              </template>
            </span>
          </span>
          <span class="p-ml-3 p-mr-3">|</span>
          <span class="syntax-title">Nhóm hàng hoá: </span>
          <span>{{ productGroup.name }}</span>
        </div>
        <div class="ls-header-info-live">
          <span>
            <span class="info-live-num"> {{ totalViewer }}</span>
            <span v-if="isStatusVOD"> Người đã xem</span>
            <span v-else> Người đang xem</span>
          </span>
          <span>
            <span> / </span>
            <span class="info-live-num"> {{ totalComment }}</span>
            <span> Bình luận</span>
          </span>
          <span>
            <span> / </span>
            <span class="info-live-num"> {{ totalReaction }}</span>
            <span> Lượt thích</span>
          </span>
          <span>
            <span> / </span>
            <span class="info-live-num"> {{ totalCustomer }}</span>
            <span> Khách hàng</span>
          </span>
          <span>
            <span> / </span>
            <span class="info-live-num"> {{ totalOrder }}</span>
            <span> Đơn hàng</span>
          </span>
        </div>
      </div>
    </div>
    <div class="ls-detail__body">
      <div class="ls-detail__body__left">
        <div class="ls-detail-comment-header">
          <span class="header-left">Bình luận từ livestream</span>
          <div class="header-right">
            <span
              class="refresh-live"
              v-tooltip.top="'Làm mới dữ liệu'"
              @click="refreshLivestream()"
              ><i class="pi pi-replay"></i
            ></span>
            <span class="video-end" v-if="isStatusVOD">Đã kết thúc</span>
            <span class="video-live" v-else>Đang Live</span>
          </div>
        </div>
        <div
          class="ls-detail-comment-body"
          v-chat-scroll="{
            always: false,
            smooth: true,
            scrollonremoved: true,
            smoothonremoved: false,
          }"
        >
          <template v-if="totalComment">
            <div
              class="ls-comment-card p-mb-3"
              v-for="comment in comments"
              :key="comment.id"
              @click.right="openMenuOption($event, comment)"
            >
              <div class="ls-comment-item">
                <img
                  :src="comment.sender.avatar"
                  alt="Avatar"
                  class="ls-comment-item__avatar"
                />
                <div class="ls-comment-item__info">
                  <p class="info-name">{{ comment.sender.name }}</p>
                  <p class="info-comment">
                    {{ comment.message }}
                  </p>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="ls-comment-empty">
              <img
                width="156px"
                src="/assets/layout/images/misa/ic_Khong_Tin_Nhan0.svg"
              />
              <p class="p-mt-2">Chưa có bình luận nào ...</p>
            </div>
          </template>
        </div>
      </div>
      <div class="ls-detail__body__right">
        <div class="ls-detail-order-header">
          <div><span> Đơn hàng</span></div>
        </div>
        <div class="ls-detail-order-body">
          <TabView>
            <TabPanel header="DANH SÁCH ĐƠN">
              <DataTable
                ref="dt1"
                :loading="isLoadingOrder"
                :value="orders"
                :selection.sync="selectedOrders"
                :filters="filterOrders"
                :paginator="orders.length > 9"
                :rows="10"
                :scrollable="true"
                :expandedRows.sync="expandedRows"
                dataKey="id"
                scrollHeight="600px"
                style="width: 100%"
              >
                <template #header>
                  <div class="p-grid p-nogutter">
                    <div class="p-col-6 p-pt-2" style="text-align: left">
                      <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText
                          v-model="filterOrders['global']"
                          placeholder="Nhập tên khách hàng, mã SKU để tìm kiếm ..."
                        />
                      </span>
                    </div>
                    <div class="p-col-6" style="text-align: right">
                      <Button
                        label="Làm mới dữ liệu"
                        icon="pi pi-refresh"
                        class="p-button-primary p-mr-2"
                        @click="refreshData()"
                      />
                      <Button
                        label="Tạo đơn"
                        icon="pi pi-plus"
                        class="p-button-success p-mr-2"
                        @click="openPopUpCreateOrder()"
                      />
                      <Button
                        label="Hoạt động gần đây"
                        icon="pi pi-bell"
                        class="p-button-help p-mr-2"
                        @click="toggleActivityLog()"
                      />
                    </div>
                  </div>
                </template>
                <Column :expander="true" headerStyle="width: 3rem" />
                <Column field="status" headerStyle="width: 3rem">
                  <template #body="slotProps">
                    <template
                      v-if="
                        slotProps.data.status > 1 && slotProps.data.status < 7
                      "
                    >
                      <span v-tooltip.top="'Đã chốt đơn thành công'">
                        <i class="pi pi-check" style="color:green"></i>
                      </span>
                    </template>
                    <template
                      v-if="
                        slotProps.data.status == 0 || slotProps.data.status == 7
                      "
                    >
                      <span v-tooltip.top="'Chốt đơn thất bại'">
                        <i class="pi pi-times" style="color:red"></i>
                      </span>
                    </template>
                    <template v-if="slotProps.data.status == 1">
                      <span v-tooltip.top="'Chưa chốt đơn'">
                        <i class="pi pi-reply" style="color:red"></i>
                      </span>
                    </template>
                  </template>
                </Column>

                <Column
                  headerStyle="width: 15%"
                  field="customer"
                  header="Người mua"
                >
                  <template #body="slotProps">
                    <p>{{ slotProps.data.customer.name }}</p>
                  </template>
                </Column>
                <Column
                  headerStyle="width: 10%"
                  field="details"
                  header="Số lượng"
                >
                  <template #body="slotProps">
                    <p>{{ slotProps.data.details.length }}</p>
                  </template>
                </Column>
                <Column
                  headerStyle="width: 15%"
                  field="total"
                  header="Tổng thanh toán"
                >
                  <template #body="slotProps">
                    <span>{{ slotProps.data.total | formatMoney() }}</span>
                  </template>
                </Column>
                <Column
                  headerStyle="width: 35%"
                  field="shippingInformation"
                  header="Thông tin GH"
                >
                  <template #body="slotProps">
                    <template v-if="slotProps.data.shippingInformation.length">
                      <span>{{
                        slotProps.data.shippingInformation[0].phone
                      }}</span>
                      <span> - </span>
                      <span>{{
                        slotProps.data.shippingInformation[0].address
                      }}</span>
                    </template>
                    <template v-else>
                      <span class="p-tag p-tag-danger">
                        Chưa chốt đơn
                      </span>
                    </template>
                  </template>
                </Column>
                <Column headerStyle="width: 15%">
                  <template #body="slotProps">
                    <template
                      v-if="
                        slotProps.data.status > 0 && slotProps.data.status < 4
                      "
                    >
                      <template v-if="slotProps.data.status < 3">
                        <Button
                          icon="pi pi-check-square"
                          iconPos="right"
                          class="p-button-rounded p-mr-2"
                          v-tooltip.top="'Chốt đơn'"
                          @click="openPopUpConfirm(slotProps.data)"
                        />
                        <Button
                          icon="pi pi-dollar"
                          iconPos="right"
                          class="p-button-secondary p-button-rounded p-mr-2"
                          v-tooltip.top="'Khuyến mại'"
                        />
                      </template>

                      <template v-if="slotProps.data.status > 2">
                        <Button
                          icon="pi pi-pencil"
                          iconPos="right"
                          class="p-button-warning p-button-rounded p-mr-2"
                          v-tooltip.top="'Cập nhật'"
                          @click="openPopUpUpdate(slotProps.data)"
                        />
                      </template>
                    </template>

                    <!-- 
                    <Button
                      icon="pi pi-comment"
                      class="p-button-rounded p-button-info p-button-outlined p-m-2"
                      @click="openPopUpChat(slotProps.data)"
                    /> -->
                  </template>
                </Column>
                <template #expansion="slotProps">
                  <div
                    class="products-wrapper"
                    v-if="
                      slotProps.data.details && slotProps.data.details.length
                    "
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
                      <Column field="quantity" header="SL"></Column>
                      <Column field="variant.stock" header="SL còn trong kho">
                        <template #body="slotProps">
                          <span>{{
                            slotProps.data.variant.stock -
                              slotProps.data.quantity
                          }}</span>
                        </template>
                      </Column>
                      <Column field="total" header="Thành tiền">
                        <template #body="slotProps">
                          <span>{{
                            slotProps.data.total | formatMoney()
                          }}</span>
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
                    <p class="p-mt-2" style="text-align:center">
                      CHƯA CÓ ĐƠN HÀNG !
                    </p>
                  </div>
                </template>
              </DataTable>
            </TabPanel>
            <TabPanel header="DANH SÁCH HÀNG HOÁ">
              <DataTable
                ref="dt2"
                :loading="isLoadingProduct"
                :value="productGroup.variants"
                :filters="filterProducts"
                :scrollable="true"
                scrollHeight="700px"
                dataKey="id"
                style="height:600px"
              >
                <template #header>
                  <div class="p-col-12">
                    <span class="p-input-icon-left">
                      <i class="pi pi-search" />
                      <InputText
                        v-model="filterProducts['global']"
                        placeholder="Nhập tên, mã SKU để tìm kiếm ..."
                      />
                    </span>
                  </div>
                </template>
                <Column header="Hình ảnh">
                  <template #body="slotProps">
                    <img
                      :src="slotProps.data.image"
                      :alt="slotProps.data.image"
                      class="ls-product-image"
                    />
                  </template>
                </Column>
                <Column field="name" header="Tên"></Column>
                <Column field="sku" header="Mã SKU"></Column>
                <Column field="sellPrice" header="Giá bán">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.sellPrice | formatMoney() }}</span>
                  </template>
                </Column>
                <Column field="stock" header="Số lượng">
                  <template #body="slotProps">
                    <span v-if="slotProps.data.stock">{{
                      slotProps.data.stock
                    }}</span>
                    <span class="p-tag p-tag-rounded p-tag-danger" v-else
                      >Hết hàng</span
                    >
                  </template>
                </Column>
                <template #empty>
                  <div class="no-found">
                    <p class="p-mt-2" style="text-align:center">
                      CHƯA THIẾT LẬP DANH SÁCH HÀNG HOÁ !
                    </p>
                  </div>
                </template>
              </DataTable>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { getJSONStorageReader } from "@/helpers/local-storage.js";

import PopUpChat from "@/components/PopUpChat.vue";
import PopUpCreateOrder from "@/components/PopUpCreateOrder.vue";
import PopUpConfirmShipping from "@/components/PopUpConfirmShipping";

import OrderMixin from "@/mixins/livestream/order";
import MenuOptionMixin from "@/mixins/livestream/menuOption";
import MessageMixin from "@/mixins/livestream/message";
import LogMixin from "@/mixins/livestream/log";
import ProductMixin from "@/mixins/livestream/product";
import LivestreamMixin from "@/mixins/livestream/livestream";

const pageCurrentLocal = getJSONStorageReader("pageCurrent");

export default {
  components: { PopUpChat, PopUpCreateOrder, PopUpConfirmShipping },

  mixins: [
    OrderMixin,
    MessageMixin,
    LogMixin,
    LivestreamMixin,
    MenuOptionMixin,
    ProductMixin,
  ],

  data() {
    return {
      expandedRows: [],
      pageCurrent: pageCurrentLocal.get(),
      pushTo: null,
      loadingSetting: {
        width: 54,
        height: 54,
        loader: "spinner",
        color: "#56A3ED",
      },
      pollTimeBetween: 1500,
      pollTimeEnd: 240000,
      pollCount: 0,
    };
  },

  async mounted() {
    if (!this.pageCurrent) return;

    const payload = {
      accessToken: this.pageCurrent.accessToken,
      livestreamId: this.$route.params.id,
    };

    await this.setLoadingFullScreen(true);
    await this.fetchLivestreamDetails(payload);
    await this.fetchSetting(payload);
    await this.setLoadingFullScreen(false);
  },

  beforeDestroy() {
    this.stopPollComment();
  },

  watch: {
    // pollCount(value) {
    // if (value >= this.pollEndTime) {
    //   this.stopPollComment();
    // }
    // },
  },

  computed: {
    ...mapState({
      conversation: (state) => state.facebook.conversation,
      livestreamDetails: (state) => state.livestream.livestreamDetails,
      productGroup: (state) => state.livestream.productGroup,
      syntax: (state) => state.livestream.syntax,
      orders: (state) => state.livestream.orders,
      commentCurrent: (state) => state.livestream.commentCurrent,
      logs: (state) => state.livestream.logs,
      carriers: (state) => state.carrier.carriers,
    }),

    ...mapGetters({
      totalComment: "livestream/totalComment",
      totalReaction: "livestream/totalReaction",
      totalViewer: "livestream/totalViewer",
      isStatusVOD: "livestream/isStatusVOD",
      livestreamStatus: "livestream/livestreamStatus",
      comments: "livestream/comments",
      totalOrder: "livestream/totalOrder",
      totalCustomer: "livestream/totalCustomer",
      totalProductAvailable: "livestream/totalProductAvailable",
    }),

    producstSearch() {
      if (this.productGroup) {
        return this.productGroup.variants;
      }
      return [];
    },
  },

  methods: {
    ...mapActions({
      getProductGroup: "livestream/getProductGroup",
      getSyntax: "livestream/getSyntax",
      getOrders: "livestream/getOrders",
      getLivestreamDetails: "livestream/getLivestreamDetails",
      getListLivestream: "livestream/getListLivestream",
      getComments: "livestream/getComments",
      addLogs: "livestream/addLogs",
      getLivestreamDB: "livestream/fetchLivestreamByFbLiveId",
      createCustomer: "customer/create",
      createCoupon: "coupon/create",
      getCustomerByFbId: "customer/fetchByFacebookId",
      getCustomerByPhone: "customer/fetchByPhone",
      getCarriers: "carrier/fetchAll",
      createOrder: "order/create",
      deleteOrder: "order/delete",
      deleteDetails: "order/deleteDetails",
      updateOrder: "order/update",
      updateShippingInOrder: "order/updateShipping",
    }),

    async fetchSetting({ livestreamId }) {
      const id = livestreamId;
      const result = await this.getLivestreamDB({ id });
      if (result && result.status) {
        const { syntaxId, productGroupId } = result.data;
        await Promise.all([
          this.getProductGroup({ id: productGroupId }),
          this.getSyntax({ id: syntaxId }),
          this.getOrders({ id: livestreamId }),
          this.getCarriers(),
        ]);
      }
    },

    async fetchLivestreamDetails(payload) {
      await this.getLivestreamDetails(payload);
      if (this.livestreamDetails && this.livestreamStatus == "LIVE") {
        await this.pollComment(payload);
      }
    },

    async pollComment(payload) {
      this.pushTo = setInterval(async () => {
        await this.getComments({ ...payload, limit: 1 });
        if (this.commentCurrent) {
          await this.createLog({
            isComment: true,
            comment: this.commentCurrent,
          });
          await this.checkRegex(this.commentCurrent);
        }

        this.pollCount += this.pollTimeBetween;
      }, this.pollTimeBetween);
    },

    async refreshData() {
      const payload = {
        accessToken: this.pageCurrent.accessToken,
        livestreamId: this.$route.params.id,
      };

      this.stopPollComment();
      await this.setLoadingAction(true);
      await this.fetchLivestreamDetails(payload);
      await this.fetchSetting(payload);
      await this.setLoadingAction(false);
    },

    async refreshLivestream() {
      const payload = {
        accessToken: this.pageCurrent.accessToken,
        livestreamId: this.$route.params.id,
      };
      await this.setLoadingAction(true);
      await this.fetchLivestreamDetails(payload);
      await this.setLoadingAction(false);
    },

    stopPollComment() {
      if (this.pushTo) {
        clearInterval(this.pushTo);
        this.pushTo = null;
      }
    },

    goBack() {
      window.location.href = "/livestream/videos";
    },

    formatSyntax(syntax) {
      if (syntax.length) {
        return syntax.join("-syntax-").split("-");
      }
      return [""];
    },

    setLoadingFullScreen(value) {
      if (!value) {
        return this.loader.hide();
      }

      this.loader = this.$loading.show({
        ...this.loadingSetting,
        opacity: 1,
      });
    },

    setLoadingAction(value) {
      if (!value) {
        return this.loader.hide();
      }

      this.loader = this.$loading.show({
        ...this.loadingSetting,
        opacity: 0.6,
      });
    },

    showToast({ severity, type, name, custom }) {
      let detail = "";
      let summary = severity == "error" ? "Lỗi" : "Thành công";

      if (custom) {
        this.$toast.add({
          severity,
          summary,
          detail: custom.title,
          life: 5000,
        });
        this.createLog({ isCustom: true, custom });
        return;
      }

      if (type == "syntax") detail = "Cú pháp";
      else if (type == "sku") detail = "Mã hàng hoá";
      else if (type == "stock") detail = "Số lượng hàng hoá";
      else if (type == "phone") detail = "SĐT";
      else if (type == "status") detail = "Trạng thái đơn hàng";
      else detail = "SĐT";

      if (severity == "error") {
        this.$toast.add({
          severity,
          summary,
          detail: `${detail} không hợp lệ`,
          life: 5000,
        });
        this.createLog({ isSyntax: true, syntax: detail });
      } else {
        this.$toast.add({
          severity,
          summary,
          detail: `Đã tạo đơn cho khách ${name}`,
          life: 5000,
        });
        this.createLog({ isCreateOrder: true, customerName: name });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/livestream-detail";
</style>
