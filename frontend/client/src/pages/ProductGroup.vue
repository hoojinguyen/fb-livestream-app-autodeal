<template>
  <div class="init-group-product card">
    <!-- Danh sach nhom san pham -->
    <DataView
      :value="productGroups"
      :loading="isLoading"
      layout="list"
      :paginator="true"
      :rows="5"
    >
      <template #header>
        <div class="p-grid p-nogutter">
          <div class="p-col-6 p-pt-2" style="text-align: left">
            <span>Chuẩn bị nhóm hàng hóa áp dụng khi Livestream</span>
          </div>
          <div class="p-col-6" style="text-align: right">
            <Button
              label="Thêm nhóm"
              icon="pi pi-plus"
              class="p-button-success p-mr-2"
              @click="openNew"
            />
          </div>
        </div>
      </template>

      <template #list="slotProps">
        <div class="p-col-12">
          <div class="product-list-item">
            <div class="product-list-name">
              <span>{{ slotProps.data.name }}</span>
            </div>
            <div class="product-list-detail">
              <img
                v-for="(product, index) in slotProps.data.products"
                :key="index"
                :src="product.image"
                :alt="product.image"
              />
            </div>
            <div class="product-list-action">
              <!-- <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text p-button-warning"
                @click="editGroupProduct(slotProps.data)"
              /> -->
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text p-button-danger"
                @click="openDelete(slotProps.data)"
              />
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="p-col-12" v-if="isLoading">
          <div style="text-align:center">
            <ProgressSpinner />
          </div>
        </div>
        <div
          v-else
          class="p-pt-3 p-pb-3"
          style="text-align: center; font-size: 1.2rem; font-weight: bold"
        >
          <span>Chưa có dữ liệu</span>
        </div>
      </template>
    </DataView>
    <!-- Danh sach nhom san pham -->

    <!-- Dialog Them moi nhom san pham -->
    <Dialog
      :visible.sync="isOpenNewDialog"
      :style="{ width: '800px' }"
      :header="titleDialog"
      :modal="true"
      class="p-fluid dialog-new"
    >
      <div class="p-fluid p-formgrid p-grid">
        <!-- Danh sach san pham -->
        <div class="p-field p-col-12">
          <DataTable
            ref="dt"
            :value="products"
            :selection.sync="selectedProducts"
            :paginator="true"
            :rows="3"
            :filters="filters"
            dataKey="id"
          >
            <template #header>
              <div class="p-col-12">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText
                    v-model="filters['global']"
                    placeholder="Nhập tên, mã SKU để tìm kiếm ..."
                  />
                </span>
              </div>
            </template>
            <Column
              selectionMode="multiple"
              headerStyle="width: 3rem"
              :exportable="false"
            ></Column>
            <Column header="Hình ảnh">
              <template #body="slotProps">
                <img
                  :src="slotProps.data.image"
                  :alt="slotProps.data.image"
                  class="product-image"
                />
              </template>
            </Column>
            <Column field="name" header="Tên SP"></Column>
            <Column field="sku" header="Mã SKU"></Column>
            <Column field="unit.name" header="Đơn vị tính"> </Column>
            <Column field="stock" header="Số lượng"> </Column>
            <Column field="sellPrice" header="Giá bán">
              <template #body="slotProps">
                <span>{{ slotProps.data.sellPrice | formatMoney() }}</span>
              </template>
            </Column>
            <Column field="category.name" header="Nhóm SP"></Column>
            <template #empty>
              <div class="no-found">
                <p class="p-mt-2" style="text-align:center">
                  Chưa có dữ liệu ...
                </p>
              </div>
            </template>
          </DataTable>
        </div>
        <!-- Danh sach san pham -->

        <!-- input nhap ten nhom -->
        <div class="p-field p-col-12 p-mt-3">
          <label for="name" style="font-weight:bold">Tên nhóm</label>
          <InputText
            id="name"
            v-model="productGroup.name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !productGroup.name }"
            placeholder="Nhập tên nhóm"
          />
          <small class="p-invalid" v-if="submitted && !productGroup.name"
            >Tên nhóm không hợp lệ.</small
          >
        </div>
        <!-- input nhap ten nhom -->

        <!-- Danh sach san pham them vao -->
        <div class="p-field p-col-12">
          <DataTable :value="selectedProducts">
            <Column field="name" header="Tên SP"></Column>
            <Column field="sku" header="Mã SKU"></Column>
            <Column field="sellPrice" header="Đơn giá"></Column>
            <Column :exportable="false">
              <template #body="slotProps">
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  @click="deleteSelectedProduct(slotProps.data)"
                />
              </template>
            </Column>

            <template #empty>
              <div class="no-found">
                <p class="p-mt-2" style="text-align:center">
                  Chưa có sản phẩm ...
                </p>
              </div>
            </template>
          </DataTable>
        </div>
        <!-- Danh sach san pham them vao -->
      </div>

      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button label="Lưu" icon="pi pi-check" @click="saveGroupProduct">
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Them moi nhom san pham -->
    <!-- Dialog Xoa 1 nhom san pham -->
    <Dialog
      :visible.sync="isOpenDelDialog"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="productGroup"
          >Bạn chắc chắn muốn xoá <b>{{ productGroup.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="isOpenDelDialog = false"
        />
        <Button
          label="Đồng ý"
          icon="pi pi-check"
          @click="deleteSelectedProductGroup()"
        >
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Xoa 1 nhom san pham -->
    <Toast style="text-align: left" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      productGroup: {
        products: [],
        name: "",
      },
      isOpenNewDialog: false,
      isOpenDelDialog: false,
      selectedProducts: [],
      submitted: false,
      filters: {},
      titleDialog: "",
    };
  },

  created() {
    this.getProducts();
    this.getProductGroups();
  },

  computed: {
    ...mapState({
      productGroups: (state) => state.productGroup.productGroups,
      statusCreate: (state) => state.productGroup.status.create,
      statusUpdate: (state) => state.productGroup.status.update,
      statusDelete: (state) => state.productGroup.status.delete,
      isLoading: (state) => state.productGroup.isLoading,
      isLoadingButton: (state) => state.productGroup.isLoadingButton,
      products: (state) => state.product.products,
    }),
  },

  methods: {
    ...mapActions({
      getProducts: "product/fetchAll",
      getProductGroups: "productGroup/fetchAll",
      getProductGroup: "productGroup/fetchById",
      createProductGroup: "productGroup/create",
      updateProductGroup: "productGroup/update",
      deleteProductGroup: "productGroup/delete",
    }),

    fnCleadnData() {
      const ids = this.selectedProducts.map((el) => el.id);
      return { name: this.productGroup.name, ids };
    },

    async saveGroupProduct() {
      this.submitted = true;

      if (this.productGroup.name && this.selectedProducts.length) {
        const payload = this.fnCleadnData();
        await this.createProductGroup(payload);
        if (this.statusCreate) {
          this.showToast("success", "create");
        } else {
          this.showToast("error", "create");
        }

        // reset
        this.isOpenNewDialog = false;
        this.selectedProducts = [];
        this.productGroup = {};
      }
    },

    async deleteSelectedProductGroup() {
      const { id } = this.productGroup;
      const payload = { ids: [id] };
      await this.deleteProductGroup(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.isOpenDelDialog = false;
      this.customerGroup = {};
    },

    deleteSelectedProduct(product) {
      const { id } = product;
      const products = this.selectedProducts;
      this.selectedProducts = products.filter((el) => el.id != id);
    },

    // editGroupProduct(data) {
    //   console.log("editGroupProduct -> data", data);
    // },

    showToast(severity, action) {
      let detail = "";
      let summary = severity == "error" ? "Thất bại" : "Thành công";

      if (action == "create") detail = "Tạo mới";
      else if (action == "update") detail = "Cập nhật";
      else detail = "Xoá";

      this.$toast.add({
        severity,
        summary,
        detail: `${detail} ${summary}`,
        life: 6000,
      });
    },

    async openNew() {
      this.productGroup = {};
      this.submitted = false;
      this.isOpenNewDialog = true;
      this.titleDialog = "Thêm mới nhóm sản phẩm livestream";
    },

    openDelete(productGroup) {
      this.titleDialog = "Cảnh báo !";
      this.productGroup = productGroup;
      this.isOpenDelDialog = true;
    },

    hideDialog() {
      this.submitted = false;
      this.isOpenNewDialog = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/product-group";
</style>
