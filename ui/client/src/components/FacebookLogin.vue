<template>
  <v-facebook-login
    :app-id="fbAppId"
    :options="options"
    :login-options="loginOptions"
    @sdk-init="handleSdkInit"
    @login="login"
    @logout="logout"
  >
    <template v-slot:logo>
      {{ logo }}
    </template>
    <template v-slot:login>
      <Button
        label="Đăng nhập với Facebook"
        icon="pi pi-facebook"
        class="p-button-lg p-button-rounded p-mb-4 button-fb"
      />
    </template>
    <template v-slot:logout>
      <Button
        label="Đăng xuất"
        icon="pi pi-facebook"
        class="p-button-lg p-button-rounded p-button-danger p-mb-4 button-fb"
      />
    </template>
  </v-facebook-login>
</template>

<script>
import VFacebookLogin from "vue-facebook-login-component";
import { removeFacebookLocal } from "@/utils/auth";

export default {
  name: "FacebookLogin",
  components: {
    VFacebookLogin,
  },
  data() {
    return {
      fbAppId: process.env.VUE_APP_FACEBOOK_APP_ID,
      logo: "",
      options: {
        cookie: true,
        xfbml: true,
        autoLogAppEvents: true,
        version: "v7.0",
      },
      loginOptions: {
        scope:
          "email,catalog_management,business_management,ads_read,publish_video,pages_show_list,pages_messaging,pages_read_engagement,pages_manage_ads,pages_manage_engagement,pages_manage_posts,pages_read_user_content,publish_to_groups",
      },
      FB: {},
    };
  },

  methods: {
    handleSdkInit({ FB }) {
      this.FB = FB;
    },

    login() {
      window.FB.getLoginStatus((response) => {
        console.log("login -> response", response);
        if (response.status === "connected") {
          const accessToken = response.authResponse.accessToken;
          const userID = response.authResponse.userID;
          this.$cookies.set("fb-access-token", accessToken);
          this.$cookies.set("fb-user-id", userID);
        } else {
          this.$cookies.remove("fb-access-token");
          this.$cookies.remove("fb-access-token-long-live");
          this.$cookies.remove("fb-user-id");
        }
      });
      this.$emit("login");
    },

    logout() {
      this.$cookies.remove("fb-access-token");
      this.$cookies.remove("fb-access-token-long-live");
      this.$cookies.remove("fb-user-id");
      removeFacebookLocal();
      this.$emit("logout");
    },
  },
};
</script>

<style>
.v-facebook-login {
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.button-fb {
  width: 100%;
}
</style>
