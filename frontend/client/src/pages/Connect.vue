<template>
  <div class="connect-page-wrapper">
    <div class="connect-page">
      <div class="connect-page__header">
        <div class="connect-page__header__item-wrapper">
          <!-- <div class="connect-page__header__item-wrapper__item">
            <p class="item-title">
              Chào mừng bạn đến với ứng dụng chốt đơn livestream facebook và
              quản lý hàng hoá FLAD
            </p>
            <div class="item-icon">
              <img src="assets/layout/images/logo-dark.png" alt="logo" />
            </div>
          </div> -->
          <div class="connect-page__header__item-wrapper__item">
            <div class="item-card">
              <p class="item-card__title">Kết nối ngay với Facebook</p>
              <div class="item-card__subtitle">
                <p>
                  <span class="step-text-bold">Bước 1:</span>
                  <span class="step-text-normal"
                    >Đăng nhập tài khoản Facebook.</span
                  >
                </p>
                <p>
                  <span class="step-text-bold">Bước 2:</span>
                  <span class="step-text-normal"
                    >Chọn fanpage muốn quản lý.
                  </span>
                </p>
              </div>
              <div class="item-card__fb">
                <FacebookLogin
                  @login="onFacebookLogin"
                  @logout="onFacebookLogout"
                />
                <span class="go-home" @click="goHome()"
                  >Về trang chủ <i class="pi pi-arrow-right"></i
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div class="connect-page__intro">
        <div class="connect-page__intro__item-wrapper">
          <div class="connect-page__intro__item-wrapper__item">
            <div class="item-text">
              <span class="item-step">1</span>
              <span class="item-content">
                Thiết lập cú pháp và nhóm hàng hoá cho bài livestream.
              </span>
            </div>
          </div>
          <div class="connect-page__intro__item-wrapper__item">
            <div class="item-text">
              <span class="item-step">2</span>
              <span class="item-content">
                Khi khách hàng bình luận vào bài livestream theo đúng cú pháp,
                hệ thống sẽ tự động tạo đơn cho khách hàng đó.
              </span>
            </div>
          </div>
        </div>

        <div class="connect-page__intro__item-wrapper">
          <div class="connect-page__intro__item-wrapper__item">
            <img :src="imageIntroSyntax" alt="intro-syntax" class="item-img" />
          </div>
          <div class="connect-page__intro__item-wrapper__item">
            <img :src="imageIntroDeal" alt="intro-deal" class="item-img" />
          </div>
        </div>
      </div>

      <Dialog
        header="Kết nối Fanpage"
        :visible.sync="isShowDialog"
        :style="{ width: '650px' }"
        :modal="true"
        :closable="true"
      >
        <div class="list-fanpage" v-if="pages.length">
          <div class="list-fanpage__item" v-for="page in pages" :key="page.id">
            <div class="list-fanpage__item__info">
              <img class="info-avatar" :src="page.id | getAvatarFB()" alt="" />
              <p class="info-name">{{ page.name }}</p>
            </div>

            <div class="list-fanpage__item__button">
              <Button
                v-if="page.isConnected"
                label="Ngắt kết nối"
                class="p-button-raised"
                @click="disconnectedPage(page)"
              />
              <Button
                v-else
                label=" Kết nối"
                class="p-button-raised p-button-text"
                @click="connectedPage(page)"
              />
            </div>
          </div>
        </div>
        <template #footer>
          <Button
            label="Lưu"
            icon="pi pi-check"
            @click="saveListPageAndGetData"
            class="p-button-text"
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script>
import FacebookLogin from "@/components/FacebookLogin.vue";
import { getJSONStorageReader } from "@/helpers/local-storage.js";
import { mapState, mapActions } from "vuex";
import { removeFacebookLocal } from "@/utils/auth";
import resources from "@/constants/resources";

const pageConnectedLocal = getJSONStorageReader("pageConnected");
const pageCurrentLocal = getJSONStorageReader("pageCurrent");

export default {
  components: {
    FacebookLogin,
  },

  data() {
    return {
      isShowDialog: false,
      pages: [],
      imageIntroDeal: resources.intro.deal,
      imageIntroSyntax: resources.intro.syntax,
      pageDisconnected: [],
      pageConnected: [],
    };
  },

  computed: {
    ...mapState({
      profile: (state) => state.facebook.profile,
    }),
  },

  methods: {
    ...mapActions({
      createLog: "log/create",
      getProfile: "facebook/getProfile",
      getPages: "facebook/getPages",
      getAccessTokenLongLive: "facebook/getAccessTokenLongLive",
    }),

    onFacebookLogout() {
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

    async onFacebookLogin() {
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

      await this.getProfile({ userId, accessToken });
      await this.getPages({ userId, accessToken });

      const pages = this.$_.cloneDeep(this.$store.state.facebook.pages);
      if (pages.length) {
        this.pages = await pages.map((el) => ({ ...el, isConnected: false }));
        await this.toogleDialog(true);
      }
    },

    goHome() {
      window.location.href = "/";
    },

    toogleDialog(value) {
      this.isShowDialog = value;
    },

    connectedPage(page) {
      this.pages = this.pages.map((el) => {
        if (el.id == page.id) {
          el.isConnected = true;
          this.pageConnected.push(el);
          this.pageDisconnected = this.pageDisconnected.filter(
            (p) => p.id != el.id
          );
        }
        return el;
      });
    },

    disconnectedPage(page) {
      this.pages = this.pages.map((el) => {
        if (el.id == page.id) {
          el.isConnected = false;
          this.pageDisconnected.push(el);
          this.pageConnected = this.pageConnected.filter((p) => p.id != el.id);
        }
        return el;
      });
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

    async saveListPageAndGetData() {
      const pageConnected = this.pages.filter((el) => el.isConnected);
      if (pageConnected.length) {
        pageConnectedLocal.set(pageConnected);
        pageCurrentLocal.set(pageConnected[0]);

        this.isShowDialog = false;
        await Promise.all([this.writeLogConnect(), this.writeLogDisconnect()]);
      }
      await this.goDashboard();
    },

    goDashboard() {
      window.location.href = "/";
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/connect";
</style>
