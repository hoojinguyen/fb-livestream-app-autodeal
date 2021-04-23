<template>
  <Dialog
    header="Thiết lập trước khi Livestream"
    :visible.sync="isOpen"
    :style="{ width: '40vw' }"
    position="top"
    :modal="true"
    @hide="$emit('close')"
  >
    <div class="p-m-0">
      <div class="setting-live">
        <div class="setting-live-item">
          <div class="setting-live-item__title">
            <span>Chọn nhóm sản phẩm</span>
            <span class="next-page" @click="openCreateNewGroupProduct">
              <span> Tạo mới </span>
              <i class="pi pi-angle-double-right" />
            </span>
          </div>
          <div class="setting-live-item__input">
            <select v-model="productGroupId" required>
              <option selected disabled>Chọn nhóm sản phẩm</option>
              <option
                v-for="group in productGroups"
                :key="group.id"
                :value="group.id"
              >
                {{ group.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="setting-live-item">
          <div class="setting-live-item__title">
            <span>Chọn cú pháp</span>
            <span class="next-page" @click="openCreateNewSyntax">
              <span> Tạo mới </span>
              <i class="pi pi-angle-double-right" />
            </span>
          </div>
          <div class="setting-live-item__input">
            <select v-model="syntaxId" required>
              <option selected disabled>Chọn cú pháp</option>
              <option v-for="syn in syntaxes" :key="syn.id" :value="syn.id">
                {{ formatSyntax(syn.details) }}
              </option>
            </select>
          </div>
        </div>
        <Message severity="error" v-if="error">{{ error }}</Message>
      </div>
    </div>

    <template #footer>
      <Button
        label="Quay lại"
        icon="pi pi-times"
        @click="$emit('close')"
        class="p-button-text"
      />
      <Button
        label="Hoàn thành"
        icon="pi pi-check"
        @click="finishSetting"
        autofocus
      />
    </template>
  </Dialog>
</template>

<script>
export default {
  props: {
    visible: { type: Boolean, default: false },
    productGroups: { type: Array, default: () => [] },
    syntaxes: { type: Array, default: () => [] },
  },

  data() {
    return {
      productGroupId: null,
      syntaxId: null,
      error: "",
      isOpen: false,
    };
  },

  watch: {
    visible(value) {
      this.isOpen = value;
    },
  },

  methods: {
    formatSyntax(arr) {
      if (arr && arr.length) {
        return arr.join(" - ");
      }
      return arr;
    },

    openCreateNewGroupProduct() {
      this.$router.push("/livestream/product-groups");
    },

    openCreateNewSyntax() {
      this.$router.push("/livestream/syntaxes");
    },

    finishSetting() {
      const { productGroupId, syntaxId } = this;
      if (!productGroupId) {
        this.error = "Nhóm sản phẩm được chọn không hợp lệ !";
        return;
      } else if (!syntaxId) {
        this.error = "Cú pháp được chọn không hợp lệ !";
        return;
      }
      this.$emit("finish", { productGroupId, syntaxId });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/setting-livestream";
</style>
