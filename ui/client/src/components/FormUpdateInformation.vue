<template>
  <div class="sale-form-update">
    <h5 class="title">Cập nhật thông tin khách hàng</h5>
    <div class="p-field p-fluid">
      <label for="phone">Số điện thoại</label>
      <InputText
        id="phone"
        placeholder="Nhập SĐT"
        type="text"
        v-model="form.phone"
      />
    </div>
    <div class="p-field p-fluid">
      <label for="name">Tên khách hàng</label>
      <InputText
        id="name"
        placeholder="Nhập tên"
        type="text"
        v-model="form.name"
      />
    </div>
    <div class="p-field p-fluid">
      <label for="email">Email</label>
      <InputText
        id="email"
        placeholder="Nhập email"
        type="text"
        v-model="form.email"
      />
    </div>
    <div class="p-field p-fluid">
      <label for="address">Địa chỉ</label>
      <InputText
        id="address"
        placeholder="Nhập địa chỉ"
        type="text"
        v-model="form.address"
      />
    </div>
    <div class="p-field p-fluid">
      <label for="birthday">Ngày sinh</label>
      <Calendar id="birthday" :showIcon="true" v-model="birthday" />
    </div>
    <div class="group-button">
      <Button
        label="Quay lại"
        icon="pi pi-arrow-left"
        class="p-button-link"
        @click="actionBackTo()"
      />
      <Button label="Lưu thông tin" icon="pi pi-save" @click="actionUpdate()">
        <ProgressSpinner style="width: 25px; height: 25px" v-if="loading" />
      </Button>
    </div>
  </div>
</template>

<script>
import { deepClone, formatDate } from "@/utils";
export default {
  props: {
    customer: { type: Object, default: null },
    loading: { type: Boolean, default: false },
  },

  data() {
    return {
      birthday: null,
    };
  },

  computed: {
    form() {
      const { customer } = this;
      if (customer) {
        const form = {
          name: customer.name,
          email: customer.email,
          address: customer.address,
          phone: customer.phone,
          id: customer.id,
        };
        /* eslint-disable */
        if (customer.birthday) {
          this.birthday = formatDate(customer.birthday);
        }
        return deepClone(form);
      }
      return customer;
    },
  },

  methods: {
    actionUpdate() {
      this.$emit("update", { ...this.form, birthday: this.birthday });
    },

    actionBackTo() {
      this.$emit("backTo", "update-information");
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/form-update-information";
</style>
