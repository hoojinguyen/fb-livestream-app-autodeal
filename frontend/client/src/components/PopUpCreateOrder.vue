<template>
  <Dialog
    :visible.sync="isOpen"
    :style="{ width: '30vw' }"
    :header="title"
    :modal="true"
    @hide="$emit('close')"
  >
    <div class="popup-order vld-parent" ref="popupOrder">
      <div class="p-fluid">
        <AutoComplete
          class="input-autocomplete"
          v-model="product"
          :suggestions="filteredProducts"
          :dropdown="true"
          :multiple="false"
          scrollHeight="300px"
          @complete="searchProducts($event)"
          placeholder="Nhập tên hàng hoá, mã vạch, mã SKU ..."
          field="sku"
        >
          <template #item="slotProps">
            <div class="input-autocomplete__custom">
              <div class="custom-image">
                <img :src="slotProps.item.image" />
              </div>
              <div class="custom-title">
                <span class="custom-title__main">{{ slotProps.item.sku }}</span>
                -
                <span class="custom-title__sub">{{ slotProps.item.name }}</span>
              </div>
              <div class="custom-price">
                <span>{{ slotProps.item.sellPrice | formatMoney() }}</span>
              </div>
            </div>
          </template>
        </AutoComplete>
      </div>

      <div class="p-fluid p-mt-3" v-if="product">
        <div class="p-field p-grid product-info">
          <span class="p-col-6 product-title">
            {{ product.sku }} - {{ product.name }}
          </span>
          <span class="p-col-3 product-stock">
            <input
              type="number"
              name="stock"
              min="1"
              step="1"
              :value="quantity"
              @change="updateQuantityProduct($event)"
            />
          </span>
          <span class="p-col-2 product-price">
            {{ (product.sellPrice * quantity) | formatMoney() }}
          </span>
          <span class="p-col-1 product-close" @click="removeProduct()"
            ><i class="pi pi-times"></i
          ></span>
        </div>
      </div>
      <div class="p-fluid p-mt-3">
        <div class="p-field p-grid">
          <label for="name" class="p-col-12">Tên Khách hàng</label>
          <div class="p-col-12">
            <InputText
              id="name"
              type="text"
              :value="formCustomer.name"
              v-model="formCustomer.name"
              placeholder="Nhập tên"
            />
          </div>
        </div>
        <div class="p-field p-grid">
          <label for="phone" class="p-col-12">Số điện thoại</label>
          <div class="p-col-12">
            <InputText
              id="phone"
              type="text"
              :value="formCustomer.phone"
              v-model="formCustomer.phone"
              placeholder="Nhập SĐT"
            />
          </div>
        </div>
        <div class="p-field p-grid">
          <label for="email" class="p-col-12">Email</label>
          <div class="p-col-12">
            <InputText
              id="email"
              type="text"
              :value="formCustomer.email"
              v-model="formCustomer.email"
              placeholder="Nhập Email"
            />
          </div>
        </div>
        <div class="p-field p-grid">
          <label for="address" class="p-col-12">Địa chỉ</label>
          <div class="p-col-12">
            <Textarea
              id="address"
              :value="formCustomer.address"
              v-model="formCustomer.address"
              rows="2"
              placeholder="Nhập địa chỉ"
            />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        label="Huỷ bỏ"
        icon="pi pi-times"
        class="p-button-text"
        @click="$emit('close')"
      />
      <Button
        label="Lưu"
        icon="pi pi-check"
        class="p-button-text"
        @click="saveOrder()"
      >
      </Button>
    </template>
  </Dialog>
</template>

<script>
import { deepClone } from "@/utils";

export default {
  props: {
    title: { type: String, default: "Tạo mới đơn hàng" },
    visible: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    products: { type: [Array, Object], default: () => [] },
  },

  data() {
    return {
      isOpen: false,
      filteredProducts: null,
      formCustomer: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      quantity: 1,
      product: null,
      loader: null,
    };
  },

  beforeDestroy() {
    this.formCustomer = {
      name: "",
      email: "",
      phone: "",
      address: "",
    };
    this.product = null;
    this.quantity = 1;
    this.loader = null;
  },

  watch: {
    visible(value) {
      this.isOpen = value;
      if (!value) {
        this.resetDefault();
      }
    },

    loading(value) {
      if (!value) return this.loader.hide();
      this.loader = this.$loading.show({
        width: 54,
        height: 54,
        opacity: 0.6,
        loader: "spinner",
        color: "#56A3ED",
        container: this.$refs.popupOrder,
      });
    },
  },

  methods: {
    searchProducts(event) {
      setTimeout(() => {
        if (!event.query.trim().length) {
          this.filteredProducts = [...this.products];
        } else {
          this.filteredProducts = this.products.filter((product) => {
            return product.sku
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          });
        }
      }, 250);
    },

    saveOrder() {
      // Check thong tin
      let form = deepClone({
        customer: this.formCustomer,
        variant: this.product,
        quantity: this.quantity,
      });
      this.resetDefault();
      this.$emit("create", form);
    },

    removeProduct() {
      this.product = null;
    },

    resetDefault() {
      this.formCustomer = {
        name: "",
        email: "",
        phone: "",
        address: "",
      };
      this.product = null;
      this.quantity = 1;
      this.loader = null;
    },

    updateQuantityProduct(event) {
      const { value } = event.target;
      this.quantity = value;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/popup-order";
</style>
