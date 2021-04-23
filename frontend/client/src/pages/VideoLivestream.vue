<template>
  <div class="ls-page-container">
    <SettingLivestream
      :visible="isOpenSetting"
      :productGroups="productGroups"
      :syntaxes="syntaxes"
      @finish="finishSetting"
      @close="isOpenSetting = false"
    />

    <div class="ls-page">
      <div class="ls-page__header">
        <div class="header-left">
          <span class="left-title">Danh sách Video Livestream</span>
        </div>
        <div class="header-right">
          <Button
            label="Lấy dữ liệu"
            class="p-button-outlined cus-button"
            @click="refetchData"
            :disabled="isLoadingButton"
          />
        </div>
      </div>
      <div class="ls-page__body vld-parent" ref="listVideo">
        <template v-if="listLivestream.length">
          <div class="ls-page__body__wrapper">
            <div
              class="video-item"
              v-for="live in listLivestream"
              :key="live.id"
            >
              <div class="video-status">
                <span class="video-status__end" v-if="live.status == 'VOD'"
                  >Đã kết thúc</span
                >
                <span class="video-status__live" v-else>Đang Live</span>
                <span class="video-status__time">{{
                  live.createdAt | formatDateAndTime()
                }}</span>
              </div>
              <div class="video-iframe">
                <iframe
                  :src="live.videoEmbed | formatSizeIFrame()"
                  style="border:none;overflow:hidden"
                  scrolling="no"
                  frameborder="0"
                  allowfullscreen="true"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </div>
              <div class="video-info">
                <span class="video-info__title"
                  >{{ live.title || "No title" }}
                </span>
                <span class="video-info__description">
                  {{ live.description || "No description" }}
                </span>
              </div>
              <div class="video-statistical">
                <div class="video-statistical__total">
                  <span>{{ live.totalReaction }} Thích</span>
                  |
                  <span>{{ live.totalComment }} Bình luận</span>
                  |
                  <span>{{ live.liveViewer }} Người đã xem</span>
                </div>
                <Button
                  label="Xem chi tiết"
                  icon="pi pi-chevron-right"
                  iconPos="right"
                  class="p-button-text"
                  @click="checkSetting(live)"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="not-data">
            <div class="not-data__center">
              <img width="100px" src="/assets/layout/images/misa/kctttk.png" />
              <p class="p-mt-2">{{ notification }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { getJSONStorageReader } from "@/helpers/local-storage.js";
import SettingLivestream from "@/components/SettingLivestream.vue";

const pageCurrentLocal = getJSONStorageReader("pageCurrent");

export default {
  components: {
    SettingLivestream,
  },

  data() {
    return {
      livestream: {},
      isOpenDetail: false,
      isOpenSetting: false,
      isLoadingButton: false,
      pageCurrent: pageCurrentLocal.get(),
      loadingSetting: {
        width: 54,
        height: 54,
        opacity: 0.6,
        loader: "spinner",
        color: "#56A3ED",
      },
      notification: "Chưa có dữ liệu ...",
    };
  },

  async mounted() {
    if (!this.pageCurrent) return;
    await this.refetchData();
  },

  computed: {
    ...mapState({
      listLivestream: (state) => state.livestream.listLivestream,
      productGroups: (state) => state.productGroup.productGroups,
      syntaxes: (state) => state.syntax.syntaxes,
    }),
  },

  methods: {
    ...mapActions({
      getSyntaxes: "syntax/fetchAll",
      getProductGroups: "productGroup/fetchAll",
      createLivestream: "livestream/createLivestream",
      getLivestreamByFbLiveId: "livestream/fetchLivestreamByFbLiveId",
    }),

    async refetchData() {
      if (!this.pageCurrent) return;

      await this.setLoadingAction(true);
      await this.$store.dispatch("livestream/getListLivestream", {
        pageId: this.pageCurrent.id,
        accessToken: this.pageCurrent.accessToken,
      });
      await this.setLoadingAction(false);
    },

    async checkSetting(livestream) {
      const { id } = livestream;
      const checkExist = await this.getLivestreamByFbLiveId({ id });

      if (checkExist && checkExist.status) {
        const url = `/livestream/video/detail/${id}`;
        this.$router.push(url);
      } else {
        await Promise.all([this.getSyntaxes(), this.getProductGroups()]);
        this.isOpenSetting = true;
        this.livestream = livestream;
      }
    },

    async finishSetting(setting) {
      const { id } = this.livestream;
      const facebookPageId = this.pageCurrent.id;
      const payload = {
        ...setting,
        facebookLivestreamId: id,
        facebookPageId,
      };

      await this.setLoadingFullScreen(true);
      const result = await this.createLivestream(payload);
      if (result && result.status) {
        this.isOpenSetting = false;
        const url = `/livestream/video/detail/${id}`;
        await this.$router.push(url);
      }
      await this.setLoadingFullScreen(false);
    },

    setLoadingFullScreen(value) {
      if (!value) {
        return this.loader.hide();
      }

      this.loader = this.$loading.show({
        ...this.loadingSetting,
      });
    },

    setLoadingAction(value) {
      this.isLoadingButton = value;

      if (!value) {
        return this.loader.hide();
      }

      this.loader = this.$loading.show({
        ...this.loadingSetting,
        container: this.$refs.listVideo,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/video-livestream";
</style>
