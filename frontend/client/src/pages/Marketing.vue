<template>
  <div class="marketing-container">
    <Toolbar class="p-mb-4">
      <template slot="left">
        <Button
          label="Đăng hàng hoá"
          icon="pi pi-upload"
          class="p-button-success p-mr-2"
          @click="openUploadSelected()"
          :disabled="!selectedProducts || !selectedProducts.length"
        />
        <Button
          label="Gỡ hàng hoá"
          icon="pi pi-trash"
          class="p-button-danger p-mr-2"
          @click="openDeleteSelected()"
          :disabled="!selectedProducts || !selectedProducts.length"
        />
        <Button
          label="Chia sẻ lên tường"
          icon="pi pi-share-alt"
          @click="openShareToWall()"
          :disabled="!selectedProducts || !selectedProducts.length"
        />
      </template>
    </Toolbar>

    <!-- Danh sach hang hoa -->
    <DataTable
      ref="dt"
      :loading="isLoadingTable"
      :value="products"
      :selection.sync="selectedProducts"
      :paginator="true"
      :rows="12"
      :filters="filters"
      :scrollable="true"
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
      <Column header="Hình ảnh">
        <template #body="slotProps">
          <img
            :src="slotProps.data.image"
            :alt="slotProps.data.image"
            class="product-image"
          />
        </template>
      </Column>
      <Column field="name" header="Tên hàng hoá"></Column>
      <Column field="sku" header="Mã SKU"></Column>

      <Column field="stock" header="Tồn kho"> </Column>
      <Column field="sellPrice" header="Giá bán">
        <template #body="slotProps">
          <span>{{ slotProps.data.sellPrice | formatMoney() }}</span>
        </template>
      </Column>
      <Column field="category.name" header="Nhóm hàng hoá"></Column>
      <Column field="status.name" header="Trạng thái">
        <template #body="slotProps">
          <span
            class="p-tag"
            :class="slotProps.data.status ? 'p-tag-success' : 'p-tag-danger'"
          >
            <template v-if="slotProps.data.status">
              Active
            </template>
            <template v-else>
              Unactive
            </template>
          </span>
        </template>
      </Column>
      <template #empty>
        <div style="text-align: center">
          <p class="p-mt-2">Chưa có dữ liệu ...</p>
        </div>
      </template>
    </DataTable>

    <!-- Danh sach hang hoa -->

    <!-- Dialog Chia se hang hoa len tuong  -->
    <Dialog
      :visible.sync="isOpenDialogShare"
      :style="{ width: '950px' }"
      :header="titleDialog"
      :modal="true"
      class="p-fluid dialog-new"
    >
      <div class="dialog-share vld-parent" ref="shareDialog">
        <div class="dialog-share__left">
          <div class="content-input">
            <Textarea
              :value="messagePost"
              v-model="messagePost"
              rows="10"
              placeholder="Nhập nội dung bài viết"
            />
          </div>
          <div
            class="list-image"
            v-if="selectedImages && selectedImages.length"
          >
            <img
              :src="image"
              :key="index"
              alt="product"
              v-for="(image, index) in selectedImages"
            />
          </div>
        </div>
        <div class="dialog-share__right">
          <template v-if="pages && pages.length">
            <div
              v-for="page of pages"
              :key="page.id"
              class="p-field-checkbox p-ml-3 p-mt-3"
            >
              <Checkbox
                :id="pages.id"
                :value="page"
                name="page"
                v-model="selectedPages"
              />
              <label :for="page.id">{{ page.name }}</label>
            </div>
          </template>
        </div>
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="isOpenDialogShare = false"
          :disabled="isLoadingButton"
        />
        <Button
          label="Chia sẻ"
          icon="pi pi-share-alt"
          @click="confirmShareToWall()"
          :disabled="isLoadingButton"
        >
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Chia se hang hoa len tuong  -->

    <!-- Dialog Dang va go hang hoa -->
    <Dialog
      :visible.sync="isOpenDialogWarning"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content vld-parent" ref="warningDialog">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="product">{{ contentDialog }}</span>
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="isOpenDialogWarning = false"
        />
        <template v-if="isUploadDialog">
          <Button
            label="Đồng ý"
            icon="pi pi-check"
            class="p-button-text"
            @click="uploadToCatalog()"
            :disabled="isLoadingButton"
          />
        </template>
        <template v-else>
          <Button
            label="Đồng ý"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteToCatalog()"
            :disabled="isLoadingButton"
          />
        </template>
      </template>
    </Dialog>
    <!-- Dialog Dang va go hang hoa -->

    <Toast style="text-align: left" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getJSONStorageReader } from "@/helpers/local-storage.js";

const pageConnectedLocal = getJSONStorageReader("pageConnected");

export default {
  data() {
    return {
      submitted: false,
      filters: {},
      product: {},
      selectedProducts: [],
      isOpenDialogWarning: false,
      isOpenDialogShare: false,
      isUploadDialog: false,
      titleDialog: "",
      contentDialog: "",
      isLoadingTable: false,
      isLoadingButton: false,
      loadingSetting: {
        width: 54,
        height: 54,
        loader: "spinner",
        color: "#56A3ED",
        opacity: 0.6,
      },
      messagePost: "",
      selectedPages: null,
      selectedImages: [],
      pages: [],
    };
  },

  created() {
    this.getProducts();
  },

  computed: {
    ...mapState({
      products: (state) => state.product.products,
    }),
  },

  methods: {
    ...mapActions({
      getProducts: "product/fetchAll",
      ShareProductToWall: "facebook/ShareProductToWall",
    }),

    async uploadToCatalog() {
      await this.setLoadingDialog(true, "warningDialog");
      await this.setLoadingDialog(false, "warningDialog");
    },

    async deleteToCatalog() {
      await this.setLoadingDialog(true, "warningDialog");
      await this.setLoadingDialog(false, "warningDialog");
    },

    async confirmShareToWall() {
      const payload = {
        message: this.messagePost,
        images: this.selectedImages,
        pages: this.selectedPages,
      };
      await this.setLoadingDialog(true, "shareDialog");
      await this.ShareProductToWall(payload);
      await this.setLoadingDialog(false, "shareDialog");
    },

    setLoadingTable(value) {
      this.isLoadingTable = value;
    },

    setLoadingDialog(value, dialog) {
      this.isLoadingButton = value;

      if (!value) {
        return this.loader.hide();
      }

      this.loader = this.$loading.show({
        ...this.loadingSetting,
        container: this.$refs[dialog],
      });
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

    openUploadSelected() {
      this.isUploadDialog = true;
      this.isOpenDialogWarning = true;
      this.titleDialog = "Cảnh báo !";
      this.contentDialog = `Bạn có chắc chắn muốn đăng ${this.selectedProducts.length} hàng hoá đã chọn ?`;
    },

    openDeleteSelected() {
      this.isUploadDialog = false;
      this.isOpenDialogWarning = true;
      this.titleDialog = "Cảnh báo !";
      this.contentDialog = `Bạn có chắc chắn muốn gỡ bỏ ${this.selectedProducts.length} hàng hoá đã chọn ?`;
    },

    openShareToWall() {
      this.titleDialog = "Chia sẻ lên tường";
      this.isOpenDialogShare = true;

      const pageConnected = pageConnectedLocal.get();
      if (pageConnected) {
        this.pages = pageConnected;
      }

      this.selectedImages = this.selectedProducts.map((el) => el.image);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/marketing";
</style>
