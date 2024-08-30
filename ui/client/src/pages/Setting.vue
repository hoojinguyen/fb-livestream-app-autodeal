<template>
  <div class="setting-container">
    <Toast style="text-align: left" />
    <!-- Confirm Xoa message sample -->
    <Dialog
      :visible.sync="isOpenDelMessageDialog"
      :style="{ width: '350px' }"
      :modal="true"
      :header="titleDialog"
    >
      <div class="confirmation-content vld-parent" ref="dialogDelMessage">
        <span v-if="messageSample"
          >Bạn chắc chắn muốn xoá tin nhắn mẫu này?</span
        >
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          :disabled="isLoadingButton"
          @click="isOpenDelMessageDialog = false"
        />
        <Button
          label="Đồng ý"
          icon="pi pi-check"
          :disabled="isLoadingButton"
          @click="_deleteMessageSample()"
        >
        </Button>
      </template>
    </Dialog>
    <!-- Confirm Xoa message sample -->

    <!-- Confirm Xoa comment sample -->
    <Dialog
      :visible.sync="isOpenDelCommentDialog"
      :style="{ width: '450px' }"
      :modal="true"
      :header="titleDialog"
    >
      <div class="confirmation-content vld-parent" ref="dialogDelComment">
        <span v-if="commentSample"
          >Bạn chắc chắn muốn xoá bình luận mẫu này?</span
        >
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          :disabled="isLoadingButton"
          @click="isOpenDelCommentDialog = false"
        />
        <Button
          label="Đồng ý"
          icon="pi pi-check"
          :disabled="isLoadingButton"
          @click="_deleteCommentSample()"
        >
        </Button>
      </template>
    </Dialog>
    <!-- Confirm Xoa comment sample -->

    <!-- Dialog tao moi binh luan mau -->
    <Dialog
      :visible.sync="isOpenNewCommentDialog"
      :style="{ width: '35vw' }"
      :modal="true"
      :header="titleDialog"
    >
      <div class="setting-dialog-new vld-parent" ref="dialogNewComment">
        <div class="form-item">
          <p class="form-item__title">Bình luận mẫu</p>
          <Textarea
            :value="commentSample.content"
            v-model="commentSample.content"
            rows="6"
            placeholder="Nhập nội dung bình luận mẫu"
            class="form-item__input"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          :disabled="isLoadingButton"
          @click="isOpenNewCommentDialog = false"
        />
        <Button
          v-if="isEditDialog"
          :label="titleButton"
          icon="pi pi-check"
          :disabled="isLoadingButton"
          @click="_editComment()"
        />
        <Button
          v-else
          :label="titleButton"
          icon="pi pi-check"
          :disabled="isLoadingButton"
          @click="_createComment()"
        />
      </template>
    </Dialog>
    <!-- Dialog tao moi binh luan mau -->

    <!-- Dialog tao moi tin nhan mau -->
    <Dialog
      :visible.sync="isOpenNewMessageDialog"
      :style="{ width: '35vw' }"
      :modal="true"
      :header="titleDialog"
    >
      <div class="setting-dialog-new vld-parent" ref="dialogNewMessage">
        <div class="form-item">
          <p class="form-item__title">Tin nhắn mẫu</p>
          <Textarea
            :value="messageSample.content"
            v-model="messageSample.content"
            rows="6"
            placeholder="Nhập nội dung tin nhắn mẫu"
            class="form-item__input"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          :disabled="isLoadingButton"
          @click="isOpenNewMessageDialog = false"
        />
        <Button
          v-if="isEditDialog"
          :label="titleButton"
          icon="pi pi-check"
          :disabled="isLoadingButton"
          @click="_editMessage()"
        />
        <Button
          v-else
          :label="titleButton"
          icon="pi pi-check"
          :disabled="isLoadingButton"
          @click="_createMessage()"
        />
      </template>
    </Dialog>
    <!-- Dialog tao moi tin nhan mau -->

    <!-- Ket noi fanpage -->
    <Dialog
      header="Kết nối Fanpage"
      :visible.sync="isOpenConnectPageDialog"
      :style="{ width: '650px' }"
      :modal="true"
    >
      <template v-if="pages.length">
        <div class="page-item" v-for="page in pages" :key="page.id">
          <div class="page-item__left">
            <img
              class="page-item__left__avatar"
              :src="page.id | getAvatarFB()"
              alt="fanpage"
            />
            <span class="page-item__left__name">{{ page.name }}</span>
          </div>
          <div class="page-item__right">
            <Button
              icon="pi pi-check"
              label="Kết nối"
              v-if="!page.isConnected"
              @click="connectedPage(page)"
            />
            <Button
              v-else
              icon="pi pi-times"
              label="Ngắt kết nối"
              class="p-button-outlined p-button-danger"
              @click="disconnectedPage(page)"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          :disabled="isLoadingButton"
          @click="isOpenConnectPageDialog = false"
        />
        <Button
          label="Lưu"
          icon="pi pi-check"
          :disabled="isLoadingButton"
          @click="saveListPageConnected()"
          class="p-button-text"
        />
      </template>
    </Dialog>
    <!-- Ket noi fanpage -->

    <div class="setting">
      <div class="setting__left">
        <div class="setting__left__header">
          <p class="left-title">Tài khoản kết nối</p>
          <div class="left-connect">
            <div class="left-connect__info">
              <template v-if="profile && profile.avatar">
                <img
                  class="left-connect__info__avatar"
                  :src="profile.avatar"
                  alt="avatar"
                />
              </template>
              <template v-else>
                <img
                  class="left-connect__info__avatar"
                  :src="avatarDefault"
                  alt="avatar"
                />
              </template>

              <div class="left-connect__info__name">
                <template v-if="profile">
                  <span>{{ profile.name }}</span>
                  <span>{{ profile.email }}</span>
                </template>
                <template v-else>
                  <span> {{ user.name }} </span>
                  <span> {{ user.email }} </span>
                </template>
              </div>
            </div>

            <div class="left-connect__facebook">
              <FacebookLogin
                @login="onFacebookLogin"
                @logout="onFacebookLogout"
              />
            </div>
          </div>
        </div>
        <div class="setting__left__body">
          <TabView>
            <TabPanel header="Quản lý Fanpage">
              <div class="left-page vld-parent" ref="listFanpage">
                <template v-if="pages.length">
                  <div class="page-header">
                    <span class="update" @click="openConnectPage()">
                      <i class="pi pi-pencil p-pl-2"
                    /></span>
                  </div>
                  <div class="page-item" v-for="page in pages" :key="page.id">
                    <div class="page-item__left">
                      <img
                        class="page-item__left__avatar"
                        :src="page.id | getAvatarFB()"
                        alt="fanpage"
                      />
                      <span class="page-item__left__name">{{ page.name }}</span>
                    </div>
                    <div class="page-item__right">
                      <span
                        v-if="page.isConnected"
                        class="page-item__right__connect"
                        >Đã kết nối</span
                      >
                      <span v-else class="page-item__right__disconnect"
                        >Chưa kết nối</span
                      >
                    </div>
                  </div>
                </template>
              </div>
            </TabPanel>
            <TabPanel header="Quản lý tài khoản">
              <div class="left-account vld-parent" ref="formUser">
                <div class="left-account__item">
                  <div class="left-account__item__header">
                    <span class="title"> Thông tin tài khoản:</span>
                    <span class="update" @click="toggleUpdateUser()">
                      <i class="pi pi-pencil p-pl-2"
                    /></span>
                  </div>
                  <div class="p-field p-fluid">
                    <label for="name">Tên</label>
                    <InputText
                      id="name"
                      placeholder="Nhập tên"
                      type="text"
                      :disabled="!isEditUser"
                      v-model="formUser.name"
                    />
                  </div>
                  <div class="p-field p-fluid">
                    <label for="phone">Số điện thoại</label>
                    <InputText
                      id="phone"
                      placeholder="Nhập SĐT"
                      type="text"
                      :disabled="!isEditUser"
                      v-model="formUser.phone"
                    />
                  </div>
                  <div class="p-field p-fluid">
                    <label for="email">Email</label>
                    <InputText
                      id="email"
                      placeholder="Nhập Email"
                      type="text"
                      :disabled="!isEditUser"
                      v-model="formUser.email"
                    />
                  </div>
                  <div class="p-field p-fluid">
                    <label for="address">Địa chỉ</label>
                    <InputText
                      id="address"
                      placeholder="Nhập địa chỉ"
                      type="text"
                      :disabled="!isEditUser"
                      v-model="formUser.address"
                    />
                  </div>
                  <div class="left-account__item__footer" v-if="isEditUser">
                    <div>
                      <Button
                        icon="pi pi-times"
                        class="p-button-outlined p-button-danger"
                        label="Huỷ bỏ"
                        @click="isEditUser = false"
                      />
                    </div>
                    <div class="p-ml-2">
                      <Button
                        icon="pi pi-check"
                        label="Cập nhật"
                        @click="_updateUser()"
                      />
                    </div>
                  </div>
                </div>
                <div class="left-account__item">
                  <div class="left-account__item__header">
                    <span class="title"> Thông tin cửa hàng:</span>
                    <span class="update" @click="toogleUpdateStore()">
                      <i class="pi pi-pencil p-pl-2"
                    /></span>
                  </div>
                  <div class="p-field p-fluid">
                    <label for="nameStore">Tên cửa hàng</label>
                    <InputText
                      id="nameStore"
                      placeholder="Nhập tên"
                      type="text"
                      :disabled="!isEditStore"
                      v-model="formStore.name"
                    />
                  </div>
                  <div class="p-field p-fluid">
                    <label for="phoneStore">Số điện thoại</label>
                    <InputText
                      id="phoneStore"
                      placeholder="Nhập SĐT"
                      type="text"
                      :disabled="!isEditStore"
                      v-model="formStore.phone"
                    />
                  </div>
                  <div class="p-field p-fluid">
                    <label for="emailStore">Email</label>
                    <InputText
                      id="emailStore"
                      placeholder="Nhập Email"
                      type="text"
                      :disabled="!isEditStore"
                      v-model="formStore.email"
                    />
                  </div>
                  <div class="p-field p-fluid">
                    <label for="cityStore">Thành phố</label>
                    <InputText
                      id="cityStore"
                      placeholder="Nhập thành phố"
                      type="text"
                      :disabled="!isEditStore"
                      v-model="formStore.city"
                    />
                  </div>
                  <div class="p-field p-fluid">
                    <label for="addressStore">Địa chỉ</label>
                    <InputText
                      id="addressStore"
                      placeholder="Nhập địa chỉ"
                      type="text"
                      :disabled="!isEditStore"
                      v-model="formStore.address"
                    />
                  </div>
                  <div class="left-account__item__footer" v-if="isEditStore">
                    <div>
                      <Button
                        icon="pi pi-times"
                        class="p-button-outlined p-button-danger"
                        label="Huỷ bỏ"
                        @click="isEditStore = false"
                      />
                    </div>
                    <div class="p-ml-2">
                      <Button
                        icon="pi pi-check"
                        label="Cập nhật"
                        @click="_updateStore()"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
      <div class="setting__right">
        <div class="setting__right__row">
          <div class="setting__right__row__title">
            <span class="name">Quản lý thiết lập tự động</span>
          </div>
          <div class="setting__right__row__auto">
            <div class="auto-item" v-for="auto in autoSettings" :key="auto.id">
              <span class="auto-item__name">{{ auto.name }}</span>
              <InputSwitch v-model="auto.checked" />
            </div>
          </div>
        </div>
        <div class="setting__right__row">
          <div class="setting__right__row__title">
            <span class="name">Quản lý tin nhắn mẫu</span>
            <Button
              icon="pi pi-plus"
              label="Tạo mới"
              class="p-button-success p-button-outlined"
              @click="openNew('message')"
            />
          </div>
          <div class="setting__right__row__list">
            <template v-if="messageSamples.length">
              <div
                class="list-item"
                v-for="mess in messageSamples"
                :key="mess.id"
              >
                <span class="list-item__title">{{ mess.content }} </span>
                <div class="list-item__action">
                  <span
                    class="list-item__action__edit"
                    @click="openEdit('message', mess)"
                    v-tooltip.top="'Chỉnh sửa'"
                    ><i class="pi pi-pencil"
                  /></span>
                  <span
                    class="p-pl-3 list-item__action__delete"
                    @click="openDelete('message', mess)"
                    v-tooltip.top="'Xoá'"
                    ><i class="pi pi-trash"
                  /></span>
                </div>
              </div>
            </template>
            <template v-else>
              <div style="text-align: center; padding-top: 15px">
                <span>Chưa có dữ liệu ...</span>
              </div>
            </template>
          </div>
        </div>
        <div class="setting__right__row">
          <div class="setting__right__row__title">
            <span class="name">Quản lý bình luận mẫu</span>
            <Button
              icon="pi pi-plus"
              label="Tạo mới"
              class="p-button-success p-button-outlined"
              @click="openNew('comment')"
            />
          </div>
          <div class="setting__right__row__list">
            <template v-if="commentSamples.length">
              <div
                class="list-item"
                v-for="com in commentSamples"
                :key="com.id"
              >
                <span class="list-item__title">{{ com.content }} </span>
                <div class="list-item__action">
                  <span
                    class="list-item__action__edit"
                    v-tooltip.top="'Chỉnh sửa'"
                    @click="openEdit('comment', com)"
                    ><i class="pi pi-pencil"
                  /></span>
                  <span
                    class="p-pl-3 list-item__action__delete"
                    @click="openDelete('comment', com)"
                    v-tooltip.top="'Xoá'"
                    ><i class="pi pi-trash"
                  /></span>
                </div>
              </div>
            </template>

            <template v-else>
              <div style="text-align: center; padding-top: 15px">
                <span>Chưa có dữ liệu ...</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FacebookLogin from "@/components/FacebookLogin.vue";
import resources from "@/constants/resources";
import { getJSONStorageReader } from "@/helpers/local-storage.js";
import { removeFacebookLocal } from "@/utils/auth";
import { mapState, mapActions } from "vuex";
import { deepClone } from "@/utils";

const pageConnectedLocal = getJSONStorageReader("pageConnected");
const pageCurrentLocal = getJSONStorageReader("pageCurrent");

export default {
  components: { FacebookLogin },

  data() {
    return {
      avatarDefault: resources.avatarDefault,
      formUser: {},
      formStore: {},
      isEditUser: false,
      isEditStore: false,
      loadingSetting: {
        width: 54,
        height: 54,
        loader: "spinner",
        color: "#56A3ED",
        opacity: 0.6,
      },
      pages: [],
      autoSettings: [
        {
          id: 1,
          name: "Tự động ẩn bình luận trên trang",
          value: "hideComment",
          checked: true,
        },
        {
          id: 2,
          name: "Tự động thích bình luận khách hàng",
          value: "likeComment",
          checked: true,
        },
        {
          id: 3,
          name: "Tự động gửi thông tin đơn hàng qua tin nhắn cho khách hàng",
          value: "sendMessageOrder",
          checked: true,
        },
        {
          id: 4,
          name: "Tự động tag hội thoai",
          value: "tagConversation",
          checked: false,
        },
      ],
      isLoadingButton: false,
      isOpenDelMessageDialog: false,
      isOpenDelCommentDialog: false,
      isOpenNewMessageDialog: false,
      isOpenNewCommentDialog: false,
      isOpenConnectPageDialog: false,
      isEditDialog: false,
      titleDialog: "",
      titleButton: "",
      messageSample: { content: "" },
      messageSampleDefault: { content: "" },
      commentSample: { content: "" },
      commentSampleDefault: { content: "" },
      pageDisconnected: [],
      pageConnected: [],
    };
  },

  async mounted() {
    // await this._getPages();
    await Promise.all([
      this.getCommentSamples(),
      this.getMessageSamples(),
      this.getUser(),
      this.getStore(),
      this.getProfile(),
    ]);

    this.formStore = deepClone(this.store);
    this.formUser = deepClone(this.user);
  },

  computed: {
    ...mapState({
      messageSamples: (state) => state.messageSample.messageSamples,
      commentSamples: (state) => state.commentSample.commentSamples,
      statusCreateMessage: (state) => state.messageSample.status.create,
      statusUpdateMessage: (state) => state.messageSample.status.update,
      statusDeleteMessage: (state) => state.messageSample.status.delete,
      statusCreateComment: (state) => state.commentSample.status.create,
      statusUpdateComment: (state) => state.commentSample.status.update,
      statusDeleteComment: (state) => state.commentSample.status.delete,
      profile: (state) => state.facebook.profile,
      user: (state) => state.user.user,
      store: (state) => state.store.store,
    }),
  },
  methods: {
    ...mapActions({
      getCommentSamples: "commentSample/fetchAll",
      getMessageSamples: "messageSample/fetchAll",
      createCommentSample: "commentSample/create",
      createMessageSample: "messageSample/create",
      updateCommentSample: "commentSample/update",
      updateMessageSample: "messageSample/update",
      deleteCommentSample: "commentSample/delete",
      deleteMessageSample: "messageSample/delete",
      createLog: "log/create",
      getUser: "user/fetchById",
      updateUser: "user/update",
      getStore: "store/fetchByUserId",
      updateStore: "store/update",
      getProfile: "facebook/getProfile",
      getPages: "facebook/getPages",
      getAccessTokenLongLive: "facebook/getAccessTokenLongLive",
    }),

    async _getProfile() {
      let accessTokenLongLive = this.$cookies.get("fb-access-token-long-live");
      let userId = this.$cookies.get("fb-user-id");
      let accessToken = this.$cookies.get("fb-access-token");

      if (!accessToken) return;

      if (accessTokenLongLive) {
        accessToken = accessTokenLongLive;
      }

      await this.getProfile({ userId, accessToken });
    },

    async _getPages() {
      let userId = this.$cookies.get("fb-user-id");
      let accessToken = this.$cookies.get("fb-access-token");
      let accessTokenLongLive = this.$cookies.get("fb-access-token-long-live");

      if (!accessToken) return;

      if (accessTokenLongLive) {
        accessToken = accessTokenLongLive;
      } else {
        const resToken = await this.getAccessTokenLongLive({ accessToken });
        if (resToken && resToken.status) {
          accessToken = resToken.data.accessToken;
          this.$cookies.set("fb-access-token-long-live", accessToken);
        } else {
          await this.onFacebookLogout();
        }
      }

      await this.getPages({ userId, accessToken });
      let pagesCopy = deepClone(this.$store.state.facebook.pages);

      if (pagesCopy.length) {
        const pageConnected = pageConnectedLocal.get();
        const lookup = this.$_.keyBy(pageConnected, "id");

        pagesCopy = pagesCopy.map((el) => {
          el.isConnected = lookup[el.id] ? true : false;
          return el;
        });

        pagesCopy = this.$_.sortBy(pagesCopy, ["isConnected"]);

        this.pages = deepClone(pagesCopy);
      }
    },

    async _updateUser() {
      await this.setLoadingBlock(true, "formUser");
      await this.updateUser(this.formUser);
      await this.setLoadingBlock(false, "formUser");

      this.formUser = deepClone(this.user);
      this.isEditUser = false;
    },

    async _updateStore() {
      await this.setLoadingBlock(true, "formUser");
      await this.updateStore(this.formStore);
      await this.setLoadingBlock(false, "formUser");

      this.isEditStore = false;
      this.formStore = deepClone(this.store);
    },

    async _createComment() {
      const { content } = this.commentSample;
      if (!content) return;

      this.setLoadingBlock(true, "dialogNewComment");

      const payload = { title: content, content };
      await this.createCommentSample(payload);
      if (this.statusCreateComment) {
        this.showToast("success", "create");
      } else {
        this.showToast("error", "create");
      }

      this.isOpenNewCommentDialog = false;
      this.commentSample = this.commentSampleDefault;
      this.setLoadingBlock(false, "dialogNewComment");
    },

    async _editComment() {
      const { content, id } = this.commentSample;
      if (!content || !id) return;

      this.setLoadingBlock(true, "dialogNewComment");

      const payload = { id, content };
      await this.updateCommentSample(payload);
      if (this.statusUpdateComment) {
        this.showToast("success", "update");
      } else {
        this.showToast("error", "update");
      }

      this.isOpenNewCommentDialog = false;
      this.commentSample = this.commentSampleDefault;
      this.setLoadingBlock(false, "dialogNewComment");
    },

    async _deleteCommentSample() {
      await this.setLoadingBlock(true, "dialogDelComment");

      const { id } = this.commentSample;
      const payload = { ids: [id] };
      await this.deleteCommentSample(payload);
      if (this.statusDeleteComment) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.isOpenDelCommentDialog = false;
      this.commentSample = this.commentSampleDefault;
      await this.setLoadingBlock(false, "dialogDelComment");
    },

    async _createMessage() {
      const { content } = this.messageSample;
      if (!content) return;

      this.setLoadingBlock(true, "dialogNewMessage");

      const payload = { title: content, content };
      await this.createMessageSample(payload);
      if (this.statusCreateMessage) {
        this.showToast("success", "create");
      } else {
        this.showToast("error", "create");
      }

      this.isOpenNewMessageDialog = false;
      this.messageSample = this.messageSampleDefault;
      this.setLoadingBlock(false, "dialogNewMessage");
    },

    async _editMessage() {
      const { content, id } = this.messageSample;
      if (!content || !id) return;
      this.setLoadingBlock(true, "dialogNewMessage");

      const payload = { id, content };
      await this.updateMessageSample(payload);
      if (this.statusUpdateMessage) {
        this.showToast("success", "update");
      } else {
        this.showToast("error", "update");
      }

      this.isOpenNewMessageDialog = false;
      this.messageSample = this.messageSampleDefault;
      this.setLoadingBlock(false, "dialogNewMessage");
    },

    async _deleteMessageSample() {
      await this.setLoadingBlock(true, "dialogDelMessage");

      const { id } = this.messageSample;
      const payload = { ids: [id] };
      await this.deleteMessageSample(payload);
      if (this.statusDeleteMessage) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.isOpenDelMessageDialog = false;
      this.messageSample = this.messageSampleDefault;
      await this.setLoadingBlock(false, "dialogDelMessage");
    },

    onFacebookLogin() {
      this._getPages();
      this._getProfile();
    },

    async onFacebookLogout() {
      let accessToken = this.$cookies.get("fb-access-token");
      if (window.FB && accessToken) {
        window.FB.logout(async () => {
          this.$cookies.remove("fb-access-token");
          this.$cookies.remove("fb-access-token-long-live");
          this.$cookies.remove("fb-user-id");
          await removeFacebookLocal();
          await location.reload();
        });
      } else {
        location.reload();
      }
    },

    connectedPage(page) {
      let pagesCopy = this.pages.map((el) => {
        if (el.id == page.id) {
          el.isConnected = true;
          this.pageConnected.push(el);
          this.pageDisconnected = this.pageDisconnected.filter(
            (p) => p.id != el.id
          );
        }
        return el;
      });

      this.pages = deepClone(pagesCopy);
    },

    disconnectedPage(page) {
      let pagesCopy = this.pages.map((el) => {
        if (el.id == page.id) {
          el.isConnected = false;
          this.pageDisconnected.push(el);
          this.pageConnected = this.pageConnected.filter((p) => p.id != el.id);
        }
        return el;
      });

      this.pages = deepClone(pagesCopy);
    },

    async writeLogConnect() {
      if (this.pageConnected.length) {
        await Promise.all(
          this.pageConnected.map(async (el) => {
            let payload = {
              type: "connected",
              value: { page: el.name, user: this.profile.name },
            };
            await this.createLog(payload);
          })
        );
      }
    },

    async writeLogDisconnect() {
      if (this.pageDisconnected.length) {
        await Promise.all(
          this.pageDisconnected.map(async (el) => {
            let payload = {
              type: "disconnected",
              value: { page: el.name, user: this.profile.name },
            };
            await this.createLog(payload);
          })
        );
      }
    },

    async saveListPageConnected() {
      const pageConnected = this.pages.filter((el) => el.isConnected);

      if (pageConnected.length) {
        pageConnectedLocal.set(pageConnected);
        pageCurrentLocal.set(pageConnected[0]);

        this.isOpenConnectPageDialog = false;
        await Promise.all([this.writeLogConnect(), this.writeLogDisconnect()]);
        await location.reload();
      }
    },

    openConnectPage() {
      this.isOpenConnectPageDialog = true;
    },

    openDelete(type, data) {
      this.titleDialog = "Cảnh báo";
      if (type == "comment") {
        this.isOpenDelCommentDialog = true;
        this.commentSample = data;
      } else if (type == "message") {
        this.isOpenDelMessageDialog = true;
        this.messageSample = data;
      }
    },

    openNew(type) {
      this.titleButton = "Xác nhận";
      this.isEditDialog = false;
      if (type == "comment") {
        this.titleDialog = "Tạo mới bình luận mẫu";
        this.isOpenNewCommentDialog = true;
        this.isOpenNewMessageDialog = false;
      } else if (type == "message") {
        this.titleDialog = "Tạo mới tin nhắn mẫu";
        this.isOpenNewMessageDialog = true;
        this.isOpenNewCommentDialog = false;
      }
    },

    openEdit(type, data) {
      this.titleButton = "Cập nhật";
      this.isEditDialog = true;
      if (type == "comment") {
        this.titleDialog = "Chỉnh sửa bình luận mẫu";
        this.isOpenNewCommentDialog = true;
        this.isOpenNewMessageDialog = false;
        this.commentSample = deepClone(data);
      } else if (type == "message") {
        this.titleDialog = "Chỉnh sửa tin nhắn mẫu";
        this.isOpenNewMessageDialog = true;
        this.isOpenNewCommentDialog = false;
        this.messageSample = deepClone(data);
      }
    },

    toogleUpdateStore() {
      if (!this.isEditStore) {
        this.formStore = deepClone(this.store);
      }
      this.isEditStore = !this.isEditStore;
    },

    toggleUpdateUser() {
      if (!this.isEditUser) {
        this.formUser = deepClone(this.user);
      }
      this.isEditUser = !this.isEditUser;
    },

    setLoadingBlock(value, block) {
      this.isLoadingButton = value;

      if (!value) {
        return this.loader.hide();
      }

      this.loader = this.$loading.show({
        ...this.loadingSetting,
        container: this.$refs[block],
      });
    },

    setLoadingFullScreen(value) {
      if (!value) {
        return this.loader.hide();
      }

      this.loader = this.$loading.show({
        ...this.loadingSetting,
      });
    },

    showToast(severity, action) {
      let detail = "";
      let summary = severity == "error" ? "Thất bại" : "Thành công";

      if (action == "create") detail = "Tạo mới";
      else if (action == "update") detail = "Cập nhật";
      else detail = "Xoá";

      this.$toast.add({
        severity,
        summary,
        detail: `${detail} ${summary}`,
        life: 2000,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/setting";
</style>
