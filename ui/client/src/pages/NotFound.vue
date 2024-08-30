<template>
  <div class="exception-body notfound-body">
    <div class="exception-container">
      <img src="assets/layout/images/logo-dark.png" alt="apollo-layout" />
      <h1>Không tìm thấy trang ...</h1>

      <Button
        label="Quay lại trang chủ"
        icon="pi pi-arrow-left"
        @click="goDashboard"
      />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goDashboard() {
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style scoped></style>
