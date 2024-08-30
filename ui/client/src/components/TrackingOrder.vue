<template>
  <div class="p-steps p-component">
    <ul role="tablist">
      <template v-for="(item, index) of model">
        <li
          :key="item.to"
          class="p-steps-item"
          :class="getItemClass(item)"
          :style="item.style"
          role="tab"
          :aria-selected="isActive(item)"
          :aria-expanded="isActive(item)"
        >
          <div>
            <p class="p-menuitem-link" role="presentation">
              <span class="p-steps-number">{{ index + 1 }}</span>
              <span class="p-steps-title">{{ item.label }}</span>
            </p>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    status: { type: Number, default: 0 },
  },

  data() {
    return {
      model: [
        {
          label: "Đã tạo đơn",
          value: 1,
        },
        {
          label: "Đã chốt đơn",
          value: 2,
        },
        {
          label: "Đã xác nhận TT GH",
          value: 3,
        },
        {
          label: "Chờ Giao hàng",
          value: 4,
        },
        {
          label: "Đang giao hàng",
          value: 5,
        },
        {
          label: "Đã giao hàng",
          value: 6,
        },
        {
          label: "Trả hàng",
          value: 7,
        },
      ],
    };
  },
  methods: {
    isActive(item) {
      return item.value == this.status;
    },

    getItemClass(item) {
      if (item.value == this.status) {
        return " p-highlight-current";
      } else if (item.value > this.status) {
        return "p-disabled";
      } else if (item.value < this.status) {
        return "p-highlight";
      }
    },
  },
};
</script>

<style>
.p-highlight-current .p-menuitem-link .p-steps-number {
  background: #b73650 !important;
  color: white !important;
}
.p-highlight-current .p-menuitem-link .p-steps-title {
  color: #b73650 !important;
  font-weight: bold;
}
.p-steps {
  position: relative;
}

.p-steps ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: flex;
}
.p-steps-item {
  position: relative;
  display: flex;
  justify-content: center;
  flex: 1 1 auto;
}
.p-steps-item .p-menuitem-link {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  text-decoration: none;
}
.p-steps-item.p-steps-current .p-menuitem-link {
  cursor: default;
}
.p-steps-title {
  white-space: nowrap;
}
.p-steps-number {
  display: flex;
  align-items: center;
  justify-content: center;
}
.p-steps-title {
  display: block;
}
</style>
