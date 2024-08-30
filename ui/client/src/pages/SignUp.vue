<template>
  <div class="auth">
    <div class="auth-container">
      <div class="auth-left">
        <h1 class="auth-title">Welcome!</h1>
        <p class="auth-desc">
          Đăng ký để trải nghiệm tương lai của bán hàng livestream.
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
            placeholder="Nhập email"
            required="true"
            autofocus
            v-model="form.email"
          />
        </div>

        <small class="p-invalid" v-if="submitted && !form.name"
          >Tên đăng nhập không hợp lệ.</small
        >
        <div class="input-block">
          <label for="name" class="input-label">Họ tên</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Nhập họ tên"
            required="true"
            autofocus
            v-model="form.name"
          />
        </div>
        <small class="p-invalid" v-if="submitted && !form.phone"
          >SĐT không hợp lệ.</small
        >
        <div class="input-block">
          <label for="phone" class="input-label">SĐT</label>
          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="Nhập số điện thoại"
            required="true"
            autofocus
            v-model="form.phone"
          />
        </div>

        <div class="input-block">
          <label for="address" class="input-label">Địa chỉ</label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Nhập địa chỉ"
            required="true"
            autofocus
            v-model="form.address"
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
          />
        </div>

        <small class="p-invalid" v-if="submitted && !checkPassword()"
          >Mật khẩu không trùng khớp.</small
        >
        <div class="input-block">
          <label for="rePassword" class="input-label">Nhập lại mật khẩu</label>
          <input
            type="password"
            name="rePassword"
            id="rePassword"
            placeholder="Nhập lại mật khẩu"
            required="true"
            autofocus
            v-model="rePassword"
          />
        </div>

        <div class="auth-buttons">
          <p class="forgot-password" @click="goLogin">
            Quay lại đăng nhập
          </p>
          <button
            class="input-button vld-parent"
            ref="signupButton"
            @click.prevent.self="actionSignUp"
          >
            Đăng ký
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

export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
        address: "",
        phone: "",
        email: "",
        role: "guest",
      },
      isError: "",
      rePassword: "",
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
          container: this.$refs.signupButton,
        });
      } else {
        this.loader.hide();
      }
    },

    validateForm() {
      const { name, password, phone, email } = this.form;
      return name && password && phone && email;
    },

    checkPassword() {
      const { password } = this.form;
      const { rePassword } = this;
      return password && rePassword && password === rePassword;
    },

    async actionSignUp() {
      const { dispatch } = this.$store;

      this.submitted = true;

      if (this.validateForm() && this.checkPassword()) {
        await this.setLoading(true);

        const payload = this.form;
        const result = await dispatch("authentication/signup", payload);

        if (!result.status) {
          this.isError = result.error;
        } else {
          const { email, password } = this.form;
          await dispatch("authentication/login", { email, password });
          window.location.href = "/connect";
        }

        await this.setLoading(false);
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
