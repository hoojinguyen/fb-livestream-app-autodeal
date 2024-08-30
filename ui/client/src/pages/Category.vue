<template>
  <div class="category-management">
    <!-- Cac button them moi , xoa  -->
    <Toolbar class="p-mb-4">
      <template slot="left">
        <Button
          label="Thêm mới"
          icon="pi pi-plus"
          class="p-button-success p-mr-2"
          @click="openNew"
        />
      </template>
    </Toolbar>
    <!-- Cac button them moi , xoa  -->

    <!-- Danh sach nhom san pham -->
    <DataTable
      ref="dt"
      :loading="isLoading"
      :value="categories"
      :paginator="true"
      :rows="12"
      :filters="filters"
      :scrollable="true"
      scrollHeight="600px"
      dataKey="id"
    >
      <template #header>
        <div class="table-header">
          <h5 class="p-m-0">Danh sách nhóm hàng hoá</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global']" placeholder="Tìm kiếm..." />
          </span>
        </div>
      </template>

      <Column field="sku" header="Mã nhóm hàng hoá"></Column>
      <Column field="name" header="Tên nhóm hàng hoá"></Column>
      <Column field="description" header="Mô tả"> </Column>
      <Column field="status.name" header="Trạng thái" :sortable="true">
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
      <template #empty>
        <div style="text-align: center">
          <p class="p-mt-2">Chưa có dữ liệu ...</p>
        </div>
      </template>
    </DataTable>
    <!-- Danh sach nhom san pham -->

    <!-- Dialog Them moi va cap nhat nhom san pham  -->
    <Dialog
      :visible.sync="isOpenNewDialog"
      :style="{ width: '400px' }"
      :header="titleDialog"
      :modal="true"
      class="p-fluid dialog-new"
    >
      <!-- Thong tin co ban -->
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12">
          <label for="sku">Mã nhóm hàng hoá</label>
          <InputText
            id="sku"
            v-model="category.sku"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !category.sku }"
          />
          <small class="p-invalid" v-if="submitted && !category.sku"
            >Mã nhóm hàng hoá không hợp lệ.</small
          >
        </div>
        <div class="p-field p-col-12">
          <label for="name">Tên nhóm hàng hoá</label>
          <InputText
            id="name"
            v-model="category.name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !category.name }"
          />
          <small class="p-invalid" v-if="submitted && !category.name"
            >Mã nhóm hàng hoá không hợp lệ.</small
          >
        </div>
        <div class="p-field p-col-12">
          <label for="parentId">Thuộc nhóm</label>
          <Dropdown
            id="parentId"
            optionLabel="name"
            v-model="category.parentId"
            :options="categoriesParent"
            autofocus
          />
        </div>
        <div class="p-field p-col-12">
          <label for="description">Mô tả</label>
          <Textarea
            id="description"
            v-model="category.description"
            rows="3"
            cols="20"
          />
        </div>
      </div>
      <!-- Thong tin co ban -->

      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog()"
        />
        <Button label="Lưu" icon="pi pi-check" @click="saveCategory()">
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Them moi va cap nhat nhom san pham  -->

    <!-- Dialog Xoa 1 san pham -->
    <Dialog
      :visible.sync="isOpenDelDialog"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="category"
          >Bạn chắc chắn muốn xoá <b>{{ category.name }}</b
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
          @click="deleteSelectedCategory()"
        >
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Xoa 1 san pham -->

    <Toast style="text-align: left" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      titleDialog: "",
      isOpenNewDialog: false,
      isOpenDelDialog: false,
      filters: {},
      submitted: false,
      category: {},
    };
  },

  created() {
    this.getCategories();
  },

  computed: {
    ...mapState({
      categories: (state) => state.category.categories,
      categoriesParent: (state) => state.category.categories,
      statusCreate: (state) => state.category.status.create,
      statusUpdate: (state) => state.category.status.update,
      statusDelete: (state) => state.category.status.delete,
      isLoading: (state) => state.category.isLoading,
      isLoadingButton: (state) => state.category.isLoadingButton,
    }),
  },

  methods: {
    ...mapActions({
      getCategories: "category/fetchAll",
      getCategory: "category/fetchById",
      createCategory: "category/create",
      updateCategory: "category/update",
      deleteCategory: "category/delete",
    }),

    async saveCategory() {
      this.submitted = true;

      if (this.category.name) {
        if (this.category.parentId) {
          this.category.parentId = this.category.parentId.id;
        }
        if (this.category.id) {
          const payload = this.category;
          await this.updateCategory(payload);
          if (this.statusUpdate) {
            this.showToast("success", "update");
          } else {
            this.showToast("error", "update");
          }
        } else {
          const payload = this.category;
          await this.createCategory(payload);
          if (this.statusCreate) {
            this.showToast("success", "create");
          } else {
            this.showToast("error", "create");
          }
        }

        this.category = {};
        this.isOpenNewDialog = false;
      }
    },

    async deleteSelectedCategory() {
      const { id } = this.category;
      const payload = { ids: [id] };
      await this.deleteCategory(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.category = {};
      this.isOpenDelDialog = false;
    },

    filterStatus(value) {
      const tag = "p-tag p-tag";
      if (value) return `${tag}-success`;
      else return `${tag}-danger`;
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

    openNew() {
      this.titleDialog = "Thêm mới nhóm hàng hoá";
      this.category = {};
      this.submitted = false;
      this.isOpenNewDialog = true;
    },

    openEdit(category) {
      this.titleDialog = "Cập nhật thông tin nhóm hàng hoá";
      this.category = { ...category };
      this.isOpenNewDialog = true;
    },

    openDelete(category) {
      this.titleDialog = "Cảnh báo !";
      this.category = category;
      this.isOpenDelDialog = true;
    },

    hideDialog() {
      this.isOpenNewDialog = false;
      this.submitted = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/category";
</style>
