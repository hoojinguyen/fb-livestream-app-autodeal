<template>
  <div class="auth">
    <div class="auth-container">
      <div class="auth-left">
        <h1 class="auth-title">Admin Login</h1>

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
            placeholder="Nhập email"
            required="true"
            autofocus
            v-model="form.email"
          />
        </div>

        <small class="p-invalid" v-if="submitted && !form.password"
          >Mật khẩu không hợp lệ.</small
        >
        <div class="input-block">
          <label for="password" class="input-label">Mật khẩu</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Nhập mật khẩu"
            required="true"
            autofocus
            v-model="form.password"
            @keyup.enter="actionLogin"
          />
        </div>
        <div class="auth-buttons">
          <button
            class="input-button vld-parent"
            ref="loginButton"
            @click.prevent.self="actionLogin"
          >
            Đăng nhập
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
import { setToken } from "@/utils/auth";

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      submitted: false,
      isError: "",
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
          container: this.$refs.loginButton,
        });
      } else {
        this.loader.hide();
      }
    },

    async actionLogin() {
      this.submitted = true;

      if (this.form.email && this.form.password) {
        await this.setLoading(true);

        const { email, password } = this.form;
        const { dispatch } = this.$store;
        const payload = { email, password };
        const result = await dispatch("authentication/login", payload);

        if (result.status) {
          if (result.data.role !== "admin") {
            this.isError = "Tài khoản không có quyền truy cập!";
          } else {
            await setToken(result.data.access_token);
            window.location.href = "/";
          }
        } else {
          this.isError = result.error;
        }

        await this.setLoading(false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./public/assets/sass/custom/pages/authentication";
</style>
