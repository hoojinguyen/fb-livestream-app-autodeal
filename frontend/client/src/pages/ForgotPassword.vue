<template>
  <div class="auth">
    <div class="auth-container">
      <div class="auth-left">
        <h1 class="auth-title">Bạn quên mật khẩu?</h1>
        <p class="auth-desc">
          Lấy lại mật khẩu một cách dễ dàng qua email đã đăng ký.
        </p>
        <template v-if="isError">
          <Message severity="error">{{ isError }}</Message>
        </template>
        <small class="p-invalid" v-if="submitted && !form.email"
          >Email không hợp lệ.</small
        >
        <div class="input-block">
          <label for="email" class="input-label">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Nhập email đã đăng ký"
            required="true"
            autofocus
            v-model="form.email"
          />
        </div>

        <div class="auth-buttons">
          <p class="forgot-password" @click="goLogin">
            Quay lại đăng nhập
          </p>
          <button
            class="input-button vld-parent"
            ref="forgotButton"
            @click.prevent.self="sendMail"
          >
            Lấy lại mật khẩu
          </button>
        </div>
      </div>
      <div class="auth-right">
        <img :src="imageBackground" alt="login" />
      </div>
    </div>
  </div>
</template>

<script>
import resources from "@/constants/resources";

const email = "vanhoinguyen98@gmail.com";

export default {
  data() {
    return {
      form: {
        email: "",
      },
      isError: "",
      submitted: false,
      imageBackground: resources.background.authentication,
    };
  },
  methods: {
    setLoading(value) {
      if (value) {
        this.loader = this.$loading.show({
          width: 20,
          height: 20,
          opacity: 0.5,
          loader: "spinner",
          color: "#4985b9",
          container: this.$refs.forgotButton,
        });
      } else {
        this.loader.hide();
      }
    },

    async sendMail() {
      console.log("vo");
      this.submitted = true;

      if (this.form.email) {
        await this.setLoading(true);
        setTimeout(async () => {
          if (this.form.email == email) {
            // api send email
            this.$router.push({ path: "/login" });
          } else {
            this.isError = "Email Không tồn tại";
          }

          await this.setLoading(false);
        }, 3000);
      }
    },

    goLogin() {
      this.$router.push({ path: "/login" });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/authentication";
</style>
