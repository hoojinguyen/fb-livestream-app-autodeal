<template>
  <div class="product-management">
    <!-- Cac button them moi , xoa  -->
    <Toolbar class="p-mb-4">
      <template slot="left">
        <Button
          label="Thêm mới"
          icon="pi pi-plus"
          class="p-button-success p-mr-2"
          @click="openNew"
        />
        <Button
          label="Xoá"
          icon="pi pi-trash"
          class="p-button-danger"
          @click="openDeleteSelected"
          :disabled="!selectedProducts || !selectedProducts.length"
        />
      </template>
    </Toolbar>
    <!-- Cac button them moi , xoa  -->

    <!-- Danh sach san pham -->
    <DataTable
      ref="dt"
      :loading="isLoading"
      :value="products"
      :selection.sync="selectedProducts"
      :paginator="true"
      :rows="12"
      :filters="filters"
      :scrollable="true"
      :expandedRows.sync="expandedRows"
      scrollHeight="600px"
      dataKey="id"
    >
      <template #header>
        <div class="table-header">
          <h5 class="p-m-0">Danh sách hàng hoá</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global']" placeholder="Tìm kiếm..." />
          </span>
        </div>
      </template>
      <Column
        selectionMode="multiple"
        headerStyle="width: 3rem"
        :exportable="false"
      ></Column>
      <Column :expander="true" headerStyle="width: 3rem" />
      <Column header="Hình ảnh">
        <template #body="slotProps">
          <img
            :src="slotProps.data.image"
            :alt="slotProps.data.image"
            class="product-image"
          />
        </template>
      </Column>
      <Column field="sku" header="Mã SKU" :sortable="true"></Column>
      <Column field="name" header="Tên hàng hoá" :sortable="true"></Column>
      <Column
        field="category.name"
        header="Nhóm hàng hoá"
        :sortable="true"
      ></Column>
      <Column field="unit.name" header="Đơn vị tính" :sortable="true"> </Column>
      <Column field="stock" header="Số lượng" :sortable="true"> </Column>
      <Column field="buyPrice" header="Giá mua" :sortable="true">
        <template #body="slotProps">
          <span>{{ slotProps.data.buyPrice | formatMoney() }}</span>
        </template></Column
      >
      <Column field="sellPrice" header="Giá bán" :sortable="true">
        <template #body="slotProps">
          <span>{{ slotProps.data.sellPrice | formatMoney() }}</span>
        </template>
      </Column>
      <Column field="status.name" header="Trạng thái" :sortable="true">
        <template #body="slotProps">
          <span
            class="p-tag"
            :class="slotProps.data.status ? 'p-tag-success' : 'p-tag-danger'"
          >
            <template v-if="slotProps.data.status">
              Còn hàng
            </template>
            <template v-else>
              Hết hàng
            </template>
          </span>
        </template>
      </Column>
      <Column :exportable="false">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-warning p-button-outlined p-mr-2"
            v-tooltip.top="'Chỉnh sửa'"
            @click="openEdit(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger p-button-outlined p-mr-2"
            v-tooltip.top="'Xoá'"
            @click="openDelete(slotProps.data)"
          />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div
          class="products-wrapper"
          v-if="slotProps.data.variants && slotProps.data.variants.length"
        >
          <DataTable
            :value="slotProps.data.variants"
            :scrollable="true"
            :loading="isLoadingButton"
            scrollHeight="300px"
            class="p-datatable-striped p-datatable-gridlines"
          >
            <template #header>
              <div class="table-header">
                <span>Chi tiết thuộc tính</span>
              </div>
            </template>
            <Column field="sku" header="Mã SKU"></Column>
            <Column field="name" header="Tên hàng hoá"></Column>
            <Column field="stock" header="Số lượng"></Column>
            <Column field="buyPrice" header="Giá mua">
              <template #body="slotProps">
                <span>{{ slotProps.data.buyPrice | formatMoney() }}</span>
              </template>
            </Column>
            <Column field="sellPrice" header="Giá bán">
              <template #body="slotProps">
                <span>{{ slotProps.data.sellPrice | formatMoney() }}</span>
              </template>
            </Column>
            <template #empty>
              <div style="text-align: center">
                <p class="p-mt-2">Chưa có dữ liệu ...</p>
              </div>
            </template>
          </DataTable>
        </div>
      </template>
      <template #empty>
        <div style="text-align: center">
          <p class="p-mt-2">Chưa có dữ liệu ...</p>
        </div>
      </template>
    </DataTable>

    <!-- Danh sach san pham -->

    <!-- Dialog Them moi va cap nhat product  -->
    <Dialog
      :visible.sync="isOpenNewDialog"
      :style="{ width: '55vw' }"
      :header="titleDialog"
      :modal="true"
      class="p-fluid dialog-new"
    >
      <!-- Thong tin co ban -->
      <h5 class="title">Thông tin cơ bản:</h5>
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12">
          <label for="name">Tên hàng hoá *</label>
          <InputText
            id="name"
            v-model="product.name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !product.name }"
          />
          <small class="p-invalid" v-if="submitted && !product.name"
            >Tên hàng hoá không hợp lệ.</small
          >
        </div>
        <div class="p-field p-col-6">
          <label for="category">Nhóm hàng hoá *</label>
          <Dropdown
            id="category"
            v-model="product.categoryId"
            :options="categories"
            optionLabel="name"
            placeholder="Chọn nhóm hàng hoá"
            :class="{ 'p-invalid': submitted && !product.categoryId }"
            autofocus
            required="true"
          />
          <small class="p-invalid" v-if="submitted && !product.categoryId"
            >Nhóm hàng hoá không hợp lệ</small
          >
        </div>
        <div class="p-field p-col-6">
          <label for="unit">Đơn vị *</label>
          <Dropdown
            id="unit"
            v-model="product.unitId"
            :options="units"
            optionLabel="name"
            placeholder="Chọn đơn vị tính"
            :class="{ 'p-invalid': submitted && !product.unitId }"
            autofocus
            required="true"
          />
          <small class="p-invalid" v-if="submitted && !product.unitId"
            >Đơn vị tính không hợp lệ</small
          >
        </div>
        <div class="p-field p-col-6">
          <label for="sku">Mã SKU</label>
          <InputText
            id="sku"
            v-model="product.sku"
            placeholder="Hệ thống tự sinh khi bỏ trống"
            autofocus
          />
        </div>
        <div class="p-field p-col-6">
          <label for="stock">Số lượng</label>
          <InputText
            id="stock"
            type="number"
            v-model="product.stock"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !product.stock }"
          />
          <small class="p-invalid" v-if="submitted && !product.stock"
            >Số lượng không hợp lệ.</small
          >
        </div>
        <div class="p-field p-col-6">
          <label for="buyPrice">Giá mua *</label>
          <InputNumber
            id="buyPrice"
            v-model="product.buyPrice"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !product.buyPrice }"
          />
          <small class="p-invalid" v-if="submitted && !product.buyPrice"
            >Giá mua không hợp lệ</small
          >
        </div>
        <div class="p-field p-col-6">
          <label for="sellPrice">Giá bán *</label>
          <InputNumber
            id="sellPrice"
            v-model="product.sellPrice"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !product.sellPrice }"
          />
          <small class="p-invalid" v-if="submitted && !product.sellPrice"
            >Giá bán không hợp lệ</small
          >
        </div>
      </div>
      <!-- Thong tin co ban -->

      <!-- Thong tin variants -->
      <h5 class="title">Thông tin thuộc tính:</h5>
      <DataTable
        :value="product.variants"
        :editingRows.sync="edittingRowVariants"
        dataKey="id"
        editMode="row"
        @row-edit-init="onRowEditInit"
        @row-edit-cancel="onRowEditCancel"
      >
        <template #header>
          <div class="p-grid">
            <div class="p-col-3">
              <InputText
                placeholder="Màu sắc"
                type="text"
                v-model="variant.color"
                required="true"
                autofocus
              />
            </div>
            <div class="p-col-3">
              <InputText
                type="text"
                placeholder="Size"
                v-model="variant.size"
                required="true"
                autofocus
              />
            </div>
            <div class="p-col-3">
              <InputText
                type="number"
                placeholder="Số lượng"
                v-model="variant.stock"
                required="true"
                autofocus
              />
            </div>
            <div class="p-col-3">
              <Button
                label="Thêm mới"
                icon="pi pi-check"
                class="p-button-success"
                @click="addVariant()"
              />
            </div>
          </div>
        </template>
        <Column field="color" header="Màu sắc">
          <template #editor="slotProps">
            <InputText v-model="slotProps.data.color" autofocus />
          </template>
        </Column>
        <Column field="size" header="Size">
          <template #editor="slotProps">
            <InputText v-model="slotProps.data.size" />
          </template>
        </Column>

        <Column field="buyPrice" header="Giá mua">
          <template #editor="slotProps">
            <InputText v-model="slotProps.data.buyPrice" />
          </template>
        </Column>
        <Column field="sellPrice" header="Giá bán">
          <template #editor="slotProps">
            <InputText v-model="slotProps.data.sellPrice" />
          </template>
        </Column>
        <Column field="stock" header="Số lượng">
          <template #editor="slotProps">
            <InputText v-model="slotProps.data.stock" />
          </template>
        </Column>
        <Column
          :rowEditor="true"
          headerStyle="width:7rem"
          bodyStyle="text-align:center"
        ></Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-secondary p-button-text"
              @click="removeVariant(slotProps.data)"
            />
          </template>
        </Column>
        <template #empty>
          <div style="text-align: center">
            <p class="p-mt-2">Chưa có dữ liệu ...</p>
          </div>
        </template>
      </DataTable>
      <!-- Thong tin variants -->

      <!-- Thong tin bo sung -->
      <h5 class="title">Thông tin bổ sung:</h5>
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="weight">Trọng lượng</label>
          <InputText
            id="weight"
            type="number"
            placeholder="Đơn vị gam"
            v-model="product.weight"
          />
        </div>
        <div class="p-field p-col-6">
          <label for="size">Kích thước đóng gói</label>
          <InputText
            id="size"
            v-model="product.size"
            placeholder="Nhập theo cú pháp dài/rộng/cao"
          />
        </div>
        <div class="p-field p-col-12">
          <label for="description">Mô tả</label>
          <Textarea
            id="description"
            v-model="product.description"
            rows="3"
            cols="20"
          />
        </div>
        <div class="p-field p-col-6" v-if="!isEdit">
          <label for="image">Ảnh hàng hoá</label>
          <div>
            <div class="input-upload">
              <input
                class="file-input-hidden"
                type="file"
                accept="video/mp4,image/x-png,image/gif,image/jpeg ,image/jpg"
                @change="handleAttachFile($event)"
                ref="fileAttach"
              />
              <div class="input-upload__file" @click="openAttachFile()">
                <i class="pi pi-plus"></i>
              </div>
              <div class="input-upload__preview">
                <div
                  class="input-upload__preview__images"
                  v-if="filesAttach.length"
                >
                  <div
                    class="item-image"
                    :key="image.id"
                    v-for="image in imagesAttach"
                  >
                    <span class="item-close" @click="deleteImageAttach(image)"
                      ><i class="pi pi-times"></i
                    ></span>
                    <img :src="image.url" :alt="image.name" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Thong tin bo sung -->

      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button label="Lưu" icon="pi pi-check" @click="saveProduct">
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Them moi va cap nhat product  -->

    <!-- Dialog Xoa Danh sach don hang -->
    <Dialog
      :visible.sync="isOpenDelDialog"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="product"
          >Bạn chắc chắn muốn xoá <b>{{ product.name }}</b
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
          @click="deleteSelectedProduct()"
        >
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Xoa 1 san pham -->

    <!-- Dialog Xoa nhung san pham da chon -->
    <Dialog
      :visible.sync="isOpenDelSelectedDialog"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="product">Bạn có muốn xoá những hàng hoá đã chọn?</span>
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="isOpenDelSelectedDialog = false"
        />
        <Button
          label="Đồng ý"
          icon="pi pi-check"
          @click="deleteSelectedProducts()"
        >
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Xoa nhung san pham da chon -->

    <Toast style="text-align: left" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import resources from "@/constants/resources";

import {
  getRandomInt,
  deepClone,
  trimString,
  omitObject,
  nonAccentVN,
} from "@/utils";

export default {
  data() {
    return {
      expandedRows: [],
      edittingRowVariants: [],
      originalRowsVariants: {},
      isOpenNewDialog: false,
      isOpenDelDialog: false,
      isOpenDelSelectedDialog: false,
      isEdit: false,
      titleDialog: "",
      submitted: false,
      filters: {},
      product: {},
      productDefault: {
        name: "",
        categoryId: null,
        unitId: null,
        sku: "",
        // stock: "",
        // sellPrice: "",
        // buyPrice: "",
        variants: [],
        size: "",
        // weight: "",
        description: "",
        image: resources.productDefault,
      },
      selectedProducts: [],
      variant: {},
      filesAttach: [],
      imagesAttach: [],
    };
  },

  async mounted() {
    await Promise.all([
      this.getUnits(),
      this.getProducts(),
      this.getCategories(),
    ]);
  },

  computed: {
    ...mapState({
      categories: (state) => state.category.categories,
      units: (state) => state.unit.units,
      products: (state) => state.product.products,
      statusCreate: (state) => state.product.status.create,
      statusUpdate: (state) => state.product.status.update,
      statusDelete: (state) => state.product.status.delete,
      isLoading: (state) => state.product.isLoading,
      isLoadingButton: (state) => state.product.isLoadingButton,
    }),
  },

  methods: {
    ...mapActions({
      getProducts: "product/fetchAll",
      getProduct: "product/fetchById",
      getCategories: "category/fetchAll",
      getUnits: "unit/fetchAll",
      createProduct: "product/create",
      updateProduct: "product/update",
      deleteProduct: "product/delete",
      uploadImage: "upload/uploadSingleFile",
    }),

    async saveProduct() {
      this.submitted = true;

      if (this.product.name) {
        let payload = await this.fnCleanProduct(deepClone(this.product));

        if (this.product.id) {
          await this.updateProduct(payload);
          if (this.statusUpdate) {
            this.showToast("success", "update");
          } else {
            this.showToast("error", "update");
          }
        } else {
          if (this.filesAttach.length) {
            payload.image = await this.uploadImage({
              fileAttach: this.filesAttach[0],
              folder: "product",
            });
          }
          await this.createProduct(payload);
          if (this.statusCreate) {
            this.showToast("success", "create");
          } else {
            this.showToast("error", "create");
          }
        }

        this.product = deepClone(this.productDefault);
        this.variant = {};
        this.filesAttach = [];
        this.imagesAttach = [];

        this.isOpenNewDialog = false;
        this.submitted = false;
      }
    },

    async deleteSelectedProduct() {
      const { id } = this.product;
      const payload = { ids: [id] };
      await this.deleteProduct(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.product = {};
      this.isOpenDelDialog = false;
    },

    async deleteSelectedProducts() {
      const ids = this.selectedProducts.map((el) => el.id);
      const payload = { ids };
      await this.deleteProduct(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.isOpenDelSelectedDialog = false;
      this.selectedProducts = null;
    },

    addVariant() {
      const { variant, product } = this;
      const { color, size, stock } = variant;
      const { buyPrice, sellPrice } = product;
      const fnCheck = color && size && stock ? true : false;
      const index = getRandomInt(1, 500);

      if (!fnCheck) return;

      let payload = { ...variant, index, stock, buyPrice, sellPrice };

      this.product.variants.push(payload);
      this.variant = {};
    },

    removeVariant(data) {
      const { variants } = this.product;
      if (data.index) {
        this.product.variants = variants.filter((el) => el.index != data.index);
      } else {
        this.product.variants = variants.filter((el) => el.id != data.id);
      }
    },

    async fnCleanProduct(product) {
      const { sku, name, variants, sellPrice, buyPrice } = product;

      // Format Sku
      if (!sku) {
        product.sku = this.fnCreateName(true, null, name, null);
      }

      // Change stock product by variants
      if (variants.length) {
        let stock = 0;
        let variantsCopy = deepClone(variants);

        product.variants = await variantsCopy.map((variant) => {
          stock += Number(variant.stock);
          const temp = {
            sku: this.fnCreateName(true, product.sku, name, variant),
            name: this.fnCreateName(false, product.sku, name, variant),
            stock: Number(variant.stock),
            color: variant.color,
            size: variant.size,
            sellPrice,
            buyPrice,
          };
          if (variant.id) {
            temp.id = variant.id;
          }
          return temp;
        });

        product.stock = stock;
      }

      product.unitId = product.unitId.id;
      product.categoryId = product.categoryId.id;
      product = omitObject(product, ["category", "unit"]);

      return product;
    },

    fnCreateName(isSku, nameSKU, name, variant) {
      name = trimString(name);

      let strName = "";
      let arrString = [];

      if (variant) {
        const { color, size } = variant;
        if (color) arrString.push(trimString(color));
        if (size) arrString.push(trimString(size));
      }

      if (isSku) {
        let sku = "";
        if (nameSKU) {
          sku = nameSKU;
        } else {
          let skuArr = name.split(" ");
          skuArr.forEach((el) => {
            sku += el.charAt(0);
          });
        }

        arrString.unshift(sku);
        strName = arrString.join("-").toUpperCase();
      } else {
        strName = `${name} (${arrString.join("/")})`;
      }

      if (isSku) {
        return nonAccentVN(strName).toUpperCase();
      }

      return strName;
    },

    openAttachFile() {
      this.$refs.fileAttach.click();
    },

    handleAttachFile(e) {
      const { files } = e.target;
      if (files.length) {
        let fileArr = Object.values(files);
        this.filesAttach = fileArr;
        this.imagesAttach = fileArr.map((el) => ({
          id: el.lastModified,
          url: URL.createObjectURL(el),
          name: el.name,
        }));
      }
    },

    deleteImageAttach({ id }) {
      this.filesAttach = this.filesAttach.filter(
        (el) => el.lastModified !== id
      );
      this.imagesAttach = this.imagesAttach.filter((el) => el.id !== id);
    },

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

    exportCSV() {
      this.$refs.dt.exportCSV();
    },

    openNew() {
      this.titleDialog = "Thêm mới hàng hoá";
      this.product = deepClone(this.productDefault);
      this.submitted = false;
      this.isOpenNewDialog = true;
      this.isEdit = false;
    },

    openEdit(product) {
      this.titleDialog = "Cập nhật thông tin hàng hoá";
      this.product = deepClone(product);
      this.isOpenNewDialog = true;
      this.isEdit = true;
    },

    openDelete(product) {
      this.titleDialog = "Cảnh báo !";
      this.product = deepClone(product);
      this.isOpenDelDialog = true;
    },

    openDeleteSelected() {
      this.titleDialog = "Cảnh báo !";
      this.isOpenDelSelectedDialog = true;
    },

    hideDialog() {
      this.isOpenNewDialog = false;
      this.submitted = false;
    },

    onRowEditInit(event) {
      this.originalRowsVariants[event.index] = {
        ...this.product.variants[event.index],
      };
    },

    onRowEditCancel(event) {
      this.product.variants[event.index] = this.originalRowsVariants[
        event.index
      ];
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/product";
</style>
