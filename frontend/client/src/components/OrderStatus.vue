<template>
  <div>
    <Button
      label="Xác nhận GH"
      class="p-button-raised p-button-success"
      v-if="status == 3"
      @click="changeStatus"
    />
    <Button
      label="Giao hàng"
      class="p-button-raised p-button-success"
      v-if="status == 4"
      @click="changeStatus"
    />
    <Button
      label="Đang giao hàng"
      class="p-button-raised p-button-success"
      v-if="status == 5"
      @click="changeStatus"
    />
    <Button
      label="Đã giao hàng"
      class="p-button-raised p-button-success"
      v-if="status == 6"
      @click="changeStatus"
    />
    <Button
      label="Trả hàng"
      class="p-button-raised p-button-warning"
      v-if="status == 7"
      @click="changeStatus"
    />
    <Button
      label="Chốt đơn"
      class="p-button-raised p-button-success"
      v-if="status == 2"
      @click="changeStatus"
    />
  </div>
</template>

<script>
import { getJSONStorageReader } from "@/helpers/local-storage.js";
const pageCurrentLocal = getJSONStorageReader("pageCurrent");

const statusName = {
  1: "Tạo đơn",
  2: "Chốt đơn",
  3: "Xác nhận GH",
  4: "Giao hàng",
  5: "Đang giao hàng",
  6: "Đã giao hàng",
  7: "Trả hàng",
  0: "Huỷ đơn",
};
export default {
  props: {
    status: { type: [String, Number], default: 1 },
    order: { type: Object, default: null },
  },

  data() {
    return {
      pageCurrent: pageCurrentLocal.get(),
    };
  },

  computed: {
    name() {
      return statusName[this.status];
    },
  },

  methods: {
    changeStatus() {
      let facebookAccessToken = null;
      if (this.pageCurrent) {
        facebookAccessToken = this.pageCurrent.accessToken;
      }

      let args = {
        order: this.order,
        status: this.status,
        facebookAccessToken,
      };
      console.log("🚀 ~ changeStatus ~ args", args);

      const { status } = this;
      switch (status) {
        case 2:
          this.$emit("confirm-order", args);
          break;
        case 3:
          this.$emit("show-popup", args);
          break;
        case 4:
          this.$emit("update-order", args);
          break;
        case 5:
          this.$emit("update-order", args);

          break;
        case 6:
          this.$emit("update-order", args);
          break;
        case 7:
          this.$emit("refund-order", args);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style></style>
