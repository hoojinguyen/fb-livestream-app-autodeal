<template>
  <div class="field">
    <div class="field-list" v-if="listAttach.length">
      <div
        class="field-list__item"
        v-for="(list, index) in listAttach"
        :key="index"
      >
        <span></span>
        <span class="item-name">{{ list.name }}</span>
        <span class="item-close" @click="removeListAttach(index)">X</span>
      </div>
    </div>

    <div class="field-button">
      <div class="field-button__item" @click="open('text')">
        <span>
          <i class="pi pi-comment p-mr-2" />
          Văn bản trả lời
        </span>
      </div>
      <div class="field-button__item" @click="open('web')">
        <span>
          <i class="pi pi-external-link p-mr-2" />
          Mở trang web
        </span>
      </div>
      <div class="field-button__item" @click="open('phone')">
        <span>
          <i class="pi pi-mobile p-mr-2" />
          Gọi điện
        </span>
      </div>
    </div>
    <div class="field-form">
      <template v-if="isText">
        <InputText
          type="text"
          v-model="attachText.name"
          class="item-input"
          placeholder="Nhập tên nút"
        />
        <Textarea
          v-model="attachText.content"
          rows="3"
          cols="50"
          placeholder="Nhập nội dung"
          class="item-input"
        />
        <div class="item-confirm">
          <Button label="Huỷ" class="p-button-text" @click="close('text')" />
          <Button label="Hoàn tất" @click="addAttach('text')" />
        </div>
      </template>
      <template v-if="isWeb">
        <InputText
          type="text"
          v-model="attachWeb.name"
          placeholder="Nhập tên nút"
          class="item-input"
        />
        <InputText
          type="text"
          v-model="attachWeb.url"
          placeholder="Nhập đường dẫn"
          class="item-input"
        />
        <div class="item-confirm">
          <Button label="Huỷ" class="p-button-text" @click="close('web')" />
          <Button label="Hoàn tất" @click="addAttach('web')" />
        </div>
      </template>

      <template v-if="isPhone">
        <InputText
          type="text"
          v-model="attachPhone.name"
          placeholder="Nhập tên nút"
          class="item-input"
        />
        <InputText
          type="text"
          v-model="attachPhone.phone"
          placeholder="Nhập SĐT"
          class="item-input"
        />
        <div class="item-confirm">
          <Button label="Huỷ" class="p-button-text" @click="close('phone')" />
          <Button label="Hoàn tất" @click="addAttach('phone')" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attachText: { name: "", content: "" },
      attachWeb: { name: "", url: "" },
      attachPhone: { name: "", phone: "" },
      isText: false,
      isWeb: false,
      isPhone: false,
      listAttach: [],
    };
  },

  methods: {
    closeAll() {
      this.isText = false;
      this.isWeb = false;
      this.isPhone = false;
    },
    reset() {
      this.attachText = {};
      this.attachWeb = {};
      this.attachPhone = {};
    },

    removeListAttach(index) {
      this.listAttach.splice(index, 1);
    },

    addAttach(type) {
      let data = null;
      if (type == "text") data = this.attachText;
      if (type == "web") data = this.attachWeb;
      if (type == "phone") data = this.attachPhone;

      if (data) {
        this.closeAll();
        this.listAttach.push(data);
        this.$emit("add", data);
      }
    },

    open(type) {
      if (type == "text") {
        this.isText = true;
        this.isWeb = false;
        this.isPhone = false;
      }
      if (type == "web") {
        this.isText = false;
        this.isWeb = true;
        this.isPhone = false;
      }
      if (type == "phone") {
        this.isText = false;
        this.isWeb = false;
        this.isPhone = true;
      }
    },

    close(type) {
      if (type == "text") this.isText = false;
      if (type == "web") this.isWeb = false;
      if (type == "phone") this.isPhone = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./public/assets/sass/custom/components/form-attach-chatbot";
</style>
