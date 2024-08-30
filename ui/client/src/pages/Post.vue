<template>
  <div class="post-container">
    <Toast style="text-align: left" />

    <!-- Confirm Xoa bai post -->
    <Dialog
      :visible.sync="isOpenDelDialog"
      :style="{ width: '450px' }"
      :modal="true"
      :header="titleDialog"
    >
      <div class="confirmation-content vld-parent" ref="dialogDel">
        <span v-if="post">Bạn chắc chắn muốn xoá bài đăng này?</span>
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          :disabled="isLoadingButton"
          @click="isOpenDelDialog = false"
        />
        <Button
          label="Đồng ý"
          icon="pi pi-check"
          :disabled="isLoadingButton"
          @click="_deletePost()"
        >
        </Button>
      </template>
    </Dialog>
    <!-- Confirm Xoa bai post -->

    <!-- Tao moi va cap nhat bai post -->
    <Dialog
      :visible.sync="isOpenNewDialog"
      :style="{ width: '35vw' }"
      :modal="true"
      :header="titleDialog"
    >
      <div class="post-dialog-new vld-parent" ref="dialogNew">
        <div class="input-item">
          <p class="input-item__title">Nội dung</p>
          <Textarea
            v-if="isEditDialog"
            :value="messageUpdate"
            v-model="messageUpdate"
            rows="6"
            placeholder="Nhập nội dung"
            class="input-item__message"
          />
          <Textarea
            v-else
            :value="post.message"
            v-model="post.message"
            rows="6"
            placeholder="Nhập nội dung"
            class="input-item__message"
          />
        </div>
        <div class="input-item" v-if="!isEditDialog">
          <p class="input-item__title">Đính kèm</p>
          <div class="input-item__description">
            <p>
              Đính kèm ảnh hoặc video. (Yêu cầu: Dung lượng nhỏ 1GB và thời
              lượng nhỏ hơn 20 phút).
            </p>
            <p>Định dạng ảnh: png, jpg, jpeg, gif</p>
            <p>Định dạng video: mp4</p>
          </div>

          <div class="input-item__upload">
            <input
              class="file-input-hidden"
              type="file"
              accept="video/mp4,image/x-png,image/gif,image/jpeg ,image/jpg"
              @change="handleAttachFile($event)"
              ref="fileAttach"
              multiple
            />
            <div class="input-item__upload__file" @click="openAttachFile()">
              <i class="pi pi-plus"></i>
            </div>
            <div class="input-item__upload__preview">
              <div
                class="input-item__upload__preview__images"
                v-if="filesAttach.length"
              >
                <div
                  class="item-image"
                  :key="image.id"
                  v-for="image in imagesAttach"
                >
                  <span class="item-close" @click="deleteImageAttach(image)"
                    ><i class="pi pi-times"></i
                  ></span>
                  <img :src="image.url" :alt="image.name" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div style="float: left" v-if="!isEditDialog">
          <template v-if="hasSchedule">
            <span class="item-close p-pr-2" @click="closeSchedule()"
              ><i class="pi pi-times"></i
            ></span>
            <Calendar
              id="time24"
              v-model="post.scheduledPublishTime"
              :showTime="true"
              :showSeconds="true"
            />
          </template>

          <Button
            v-else
            icon="pi pi-calendar-minus"
            label="Đặt lịch đăng bài"
            class="p-button-raised p-button-text"
            @click="openSchedule()"
          />
        </div>

        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          :disabled="isLoadingButton"
          @click="isOpenNewDialog = false"
        />
        <Button
          v-if="isEditDialog"
          :label="titleCreatePost"
          icon="pi pi-upload"
          :disabled="isLoadingButton"
          @click="_editPost()"
        />
        <Button
          v-else
          :label="titleCreatePost"
          icon="pi pi-upload"
          :disabled="isLoadingButton"
          @click="_createPost()"
        />
      </template>
    </Dialog>
    <!-- Tao moi va cap nhat bai post -->

    <!-- Reply All Binh luan -->
    <Dialog
      :visible.sync="isOpenReplyDialog"
      :style="{ width: '35vw' }"
      :modal="true"
      :header="titleDialog"
    >
      <div class="post-dialog-new">
        <div class="input-item">
          <p class="input-item__title">Bình luận mẫu</p>
          <Listbox
            v-model="selectedComment"
            :options="commentSamples"
            optionLabel="content"
            @change="changeCommentReply($event)"
          />
        </div>

        <div class="input-item">
          <p class="input-item__title">Bình luận</p>
          <Textarea
            :value="commentReply"
            v-model="commentReply"
            rows="6"
            placeholder="Nhập nội dung bình luận"
            class="input-item__message"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="isOpenReplyDialog = false"
        />
        <Button
          label="Trả lời ngay"
          icon="pi pi-comments"
          @click="_replyAllComments()"
          :disabled="isLoadingButton"
        >
        </Button>
      </template>
    </Dialog>
    <!-- Reply All Binh luan -->

    <!-- Danh sach cac bai posts -->
    <div class="post">
      <div class="post__header">
        <div class="header-left">
          <SelectButton
            v-model="selectedPost"
            :options="typePost"
            dataKey="value"
            optionLabel="name"
          />
        </div>
        <div class="header-right">
          <Button label="Tạo bài đăng" icon="pi pi-plus" @click="openNew()" />
          <Button
            label="Lấy dữ liệu"
            class="p-button-outlined p-ml-3"
            @click="_refetchData(selectedPost.value)"
            :disabled="isLoadingButton"
          />
        </div>
      </div>
      <div class="post__body vld-parent" ref="listPost">
        <template v-if="posts.length">
          <div class="post__body__wrapper">
            <div class="post-item" v-for="post in posts" :key="post.id">
              <div class="post-item__header">
                <div class="header-left">
                  <img
                    class="item-image"
                    :src="pageCurrent.id | getAvatarFB()"
                    alt="avatar"
                  />
                  <div class="item-info">
                    <p class="item-info__name">{{ pageCurrent.name }}</p>
                    <p class="item-info__time">
                      <span v-if="!post.isPublic">Tự động đăng lúc: </span>
                      {{ post.createdAt | formatDateAndTime() }}
                    </p>
                  </div>
                </div>
                <div class="header-right" v-if="!post.isPublic">
                  <Button
                    label="Đăng ngay"
                    icon="pi pi-angle-double-up"
                    class="p-button-outlined p-button-sm"
                    @click="_publishPostScheduled(post)"
                  />
                </div>
              </div>
              <div class="post-item__body">
                <div class="item-content">
                  <span class="item-content__text">{{ post.message }}</span>
                  <template v-if="post.images.length">
                    <div class="item-content__image">
                      <img
                        alt="attached"
                        :src="ima.src"
                        :key="posi"
                        v-for="(ima, posi) in post.images"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <template v-if="post.fullPicture">
                      <div class="item-content__image">
                        <img
                          v-if="post.fullPicture"
                          alt="avatar"
                          :src="post.fullPicture"
                        />
                      </div>
                    </template>
                  </template>
                </div>
              </div>
              <div class="post-item__footer">
                <div class="item-reaction">
                  <span
                    ><i class="pi pi-thumbs-up" />
                    {{ post.totalReaction }}</span
                  >
                  <span class="p-pl-3"
                    ><i class="pi pi-comment" /> {{ post.totalComment }}</span
                  >
                  <span class="p-pl-3"
                    ><i class="pi pi-share-alt" /> {{ post.totalShare }}</span
                  >
                  <a
                    :href="post.permalinkUrl"
                    target="blank"
                    class="p-pl-3 item-hover"
                    >Xem chi tiết<i class="pi pi-angle-right p-pl-1"
                  /></a>
                  <span class="p-pl-3 item-hover" @click="openReply(post)"
                    >Trả lời tất cả bình luận<i class="pi pi-comments p-pl-1"
                  /></span>
                </div>
                <div class="item-action">
                  <span
                    class="item-action__edit"
                    v-tooltip.top="'Chỉnh sửa bài đăng'"
                    @click="openEdit(post)"
                    ><i class="pi pi-pencil"
                  /></span>
                  <span
                    class="p-pl-3 item-action__delete"
                    v-tooltip.top="'Xoá bài đăng'"
                    @click="openDelete(post)"
                    ><i class="pi pi-trash"
                  /></span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="not-data">
            <div class="not-data__center">
              <img width="100px" src="/assets/layout/images/misa/kctttk.png" />
              <p class="p-mt-2">Chưa có dữ liệu ...</p>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- Danh sach cac bai posts -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getJSONStorageReader } from "@/helpers/local-storage.js";
import { deepClone, formatUnixDate } from "@/utils";

const pageCurrentLocal = getJSONStorageReader("pageCurrent");

export default {
  data() {
    return {
      selectedComment: null,
      selectedPost: { value: "publish", name: "Bài đã đăng" },
      typePost: [
        { value: "publish", name: "Bài đã đăng" },
        { value: "scheduled", name: "Bài chưa đăng" },
      ],
      loadingSetting: {
        width: 54,
        height: 54,
        opacity: 0.6,
        loader: "spinner",
        color: "#56A3ED",
      },
      pageCurrent: pageCurrentLocal.get(),
      isLoadingButton: false,
      isOpenDelDialog: false,
      isOpenNewDialog: false,
      isOpenReplyDialog: false,
      titleDialog: "Tạo mới bài đăng",
      titleCreatePost: "Đăng ngay",
      hasSchedule: false,
      commentReply: "",
      post: {
        message: "",
        scheduledPublishTime: null,
      },
      postDefault: {
        message: "",
        scheduledPublishTime: null,
      },
      filesAttach: [],
      imagesAttach: [],
      isEditDialog: false,
      messageUpdate: "",
    };
  },

  async mounted() {
    if (!this.pageCurrent) return;

    this.getCommentSamples();

    const payload = {
      pageId: this.pageCurrent.id,
      accessToken: this.pageCurrent.accessToken,
    };
    await this.setLoading(true);
    await this.getPublishPosts(payload);
    await this.setLoading(false);
  },

  watch: {
    async selectedPost(type) {
      if (type) {
        await this._refetchData(type.value);
      }
    },

    isOpenNewDialog(value) {
      if (!value) {
        this.hasSchedule = false;
        this.post = deepClone(this.postDefault);
        this.messageUpdate = "";
        this.filesAttach = [];
        this.imagesAttach = [];
        this.isEditDialog = false;
      }
    },

    isOpenReplyDialog(value) {
      if (!value) {
        this.post = deepClone(this.postDefault);
        this.commentReply = "";
        this.selectedComment = null;
      }
    },
  },

  computed: {
    ...mapState({
      posts: (state) => state.post.posts,
      commentSamples: (state) => state.commentSample.commentSamples,
    }),
  },

  methods: {
    ...mapActions({
      getCommentSamples: "commentSample/fetchAll",
      getPublishPosts: "post/getPublishPosts",
      getScheduledPosts: "post/getScheduledPosts",
      replyAllComments: "post/replyAllComments",
      publishPost: "post/publishPost",
      uploadMultipleFile: "upload/uploadMultipleFile",
      createPostPhoto: "post/createPostPhoto",
      createPostFeed: "post/createPostFeed",
      updatePost: "post/updatePost",
      deletePost: "post/deletePost",
    }),

    async _refetchData(type) {
      if (!this.pageCurrent) return;

      const payload = {
        pageId: this.pageCurrent.id,
        accessToken: this.pageCurrent.accessToken,
      };

      await this.setLoading(true);
      if (type == "publish") {
        await this.getPublishPosts(payload);
      } else {
        await this.getScheduledPosts(payload);
      }
      await this.setLoading(false);
    },

    async _replyAllComments() {
      const payload = {
        accessToken: this.post.accessToken,
        pagePostId: this.post.id,
        message: this.commentReply,
      };

      this.isOpenReplyDialog = false;

      await this.replyAllComments(payload);
      await this.showToast("success", "reply");
    },

    async _publishPostScheduled(post) {
      const pageId = this.pageCurrent.id;
      const accessToken = this.pageCurrent.accessToken;
      const pagePostId = post.id;

      await this.setLoading(true);
      await this.publishPost({ pagePostId, accessToken });
      await this.getScheduledPosts({ pageId, accessToken });
      await this.setLoading(false);
      await this.showToast("success", "update");
    },

    async _createPost() {
      if (!this.pageCurrent) return;

      await this.setLoadingDialogNew(true);
      try {
        const { filesAttach } = this;
        const { message, scheduledPublishTime } = this.post;
        const pageId = this.pageCurrent.id;
        const accessToken = this.pageCurrent.accessToken;
        const isPhoto = filesAttach.length;
        let payload = {
          pageId,
          accessToken,
          message,
          scheduledPublishTime: formatUnixDate(scheduledPublishTime),
        };

        if (isPhoto) {
          const images = await this.uploadMultipleFile({
            filesAttach,
            folder: "facebook",
          });
          await this.createPostPhoto({ ...payload, images });
        } else {
          await this.createPostFeed(payload);
        }

        if (this.selectedPost.value == "publish") {
          await this.getPublishPosts({ pageId, accessToken });
        } else {
          await this.getScheduledPosts({ pageId, accessToken });
        }

        await this.showToast("success", "create");

        this.isOpenNewDialog = false;
      } catch (error) {
        console.log("🚀 ~ _createPost ~ error", error);
      }
      await this.setLoadingDialogNew(false);
    },

    async _editPost() {
      await this.setLoadingDialogNew(true);
      try {
        const pageId = this.pageCurrent.id;
        const accessToken = this.pageCurrent.accessToken;
        const pagePostId = this.post.id;
        const message = this.messageUpdate;

        await this.updatePost({ pagePostId, accessToken, message });

        if (this.selectedPost.value == "publish") {
          await this.getPublishPosts({ pageId, accessToken });
        } else {
          await this.getScheduledPosts({ pageId, accessToken });
        }
        await this.showToast("success", "update");

        this.isOpenNewDialog = false;
      } catch (error) {
        console.log("🚀 ~ _editPost ~ error", error);
      }
      await this.setLoadingDialogNew(false);
    },

    async _deletePost() {
      await this.setLoadingDialogDel(true);
      try {
        const pageId = this.pageCurrent.id;
        const accessToken = this.pageCurrent.accessToken;
        const pagePostId = this.post.id;

        await this.deletePost({ pagePostId, accessToken });
        if (this.selectedPost.value == "publish") {
          await this.getPublishPosts({ pageId, accessToken });
        } else {
          await this.getScheduledPosts({ pageId, accessToken });
        }
        await this.showToast("success", "delete");

        this.isOpenDelDialog = false;
      } catch (error) {
        console.log("🚀 ~ _deletePost ~ error", error);
      }
      await this.setLoadingDialogDel(false);
    },

    openDelete(post) {
      this.post = post;
      this.isOpenDelDialog = true;
      this.titleDialog = "Cảnh báo";
    },

    openNew() {
      this.titleDialog = "Tạo mới bài đăng";
      this.titleCreatePost = "Đăng ngay";
      this.isOpenNewDialog = true;
      this.isEditDialog = false;
    },

    openEdit(post) {
      this.titleDialog = "Cập nhật bài đăng";
      this.titleCreatePost = "Cập nhật ngay";
      this.post = post;
      this.messageUpdate = post.message;
      this.isOpenNewDialog = true;
      this.isEditDialog = true;
    },

    openReply(post) {
      this.titleDialog = "Trả lời tất cả bình luận";
      this.post = post;
      this.isOpenReplyDialog = true;
    },

    changeCommentReply(event) {
      this.commentReply = event.value ? event.value.content : "";
    },

    openSchedule() {
      this.hasSchedule = true;
      this.post.scheduledPublishTime = new Date();
      this.titleCreatePost = "Đặt lịch";
    },

    closeSchedule() {
      this.hasSchedule = false;
      this.post.scheduledPublishTime = null;
      this.titleCreatePost = "Đăng ngay";
    },

    openAttachFile() {
      this.$refs.fileAttach.click();
    },

    handleAttachFile(e) {
      const { files } = e.target;
      if (files.length) {
        let fileArr = Object.values(files);
        this.filesAttach = fileArr;
        this.imagesAttach = fileArr.map((el) => ({
          id: el.lastModified,
          url: URL.createObjectURL(el),
          name: el.name,
        }));
      }
    },

    deleteImageAttach({ id }) {
      this.filesAttach = this.filesAttach.filter(
        (el) => el.lastModified !== id
      );
      this.imagesAttach = this.imagesAttach.filter((el) => el.id !== id);
    },

    setLoading(value) {
      this.isLoadingButton = value;
      if (!value) return this.loader.hide();

      this.loader = this.$loading.show({
        ...this.loadingSetting,
        container: this.$refs.listPost,
      });
    },

    setLoadingDialogNew(value) {
      this.isLoadingButton = value;
      if (!value) return this.loader.hide();

      this.loader = this.$loading.show({
        ...this.loadingSetting,
        container: this.$refs.dialogNew,
      });
    },

    setLoadingDialogDel(value) {
      this.isLoadingButton = value;
      if (!value) return this.loader.hide();

      this.loader = this.$loading.show({
        ...this.loadingSetting,
        container: this.$refs.dialogDel,
      });
    },

    showToast(severity, action) {
      let detail = "";
      let summary = severity == "error" ? "Thất bại" : "Thành công";

      if (action == "create") detail = "Tạo mới";
      else if (action == "update") detail = "Cập nhật";
      else if (action == "reply") detail = "Trả lời tất cả bình luận";
      else detail = "Xoá";

      this.$toast.add({
        severity,
        summary,
        detail: `${detail} ${summary}`,
        life: 3000,
      });
    },

    unixTimeStamp(inputDate) {
      var date = new Date(inputDate);
      return date.getTime();
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/post";
</style>
