<template>
  <div class="group-customer-management">
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

    <!-- Danh sach nhom khach hang -->
    <DataTable
      ref="dt"
      :loading="isLoading"
      :value="customerGroups"
      :paginator="true"
      :rows="12"
      :scrollable="true"
      scrollHeight="600px"
      :filters="filters"
      dataKey="id"
    >
      <template #header>
        <div class="table-header">
          <h5 class="p-m-0">Danh sách nhóm khách hàng</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global']" placeholder="Tìm kiếm..." />
          </span>
        </div>
      </template>
      <Column
        field="code"
        header="Mã nhóm khách hàng"
        :sortable="true"
      ></Column>
      <Column
        field="name"
        header="Tên nhóm khách hàng"
        :sortable="true"
      ></Column>
      <Column field="description" header="Mô tả" :sortable="true"> </Column>
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
    <!-- Danh sach nhom khach hang -->

    <!-- Dialog Them moi va cap nhat nhom khach hang  -->
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
          <label for="code">Mã nhóm khách hàng</label>
          <InputText
            id="code"
            v-model="customerGroup.code"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !customerGroup.code }"
          />
          <small class="p-invalid" v-if="submitted && !customerGroup.code"
            >Mã nhóm khách hàng không hợp lệ.</small
          >
        </div>
        <div class="p-field p-col-12">
          <label for="name">Tên nhóm khách hàng</label>
          <InputText
            id="name"
            v-model="customerGroup.name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !customerGroup.name }"
          />
          <small class="p-invalid" v-if="submitted && !customerGroup.name"
            >Mã nhóm khách hàng không hợp lệ.</small
          >
        </div>
        <div class="p-field p-col-12">
          <label for="parentId">Thuộc nhóm</label>
          <Dropdown
            id="parentId"
            optionLabel="name"
            v-model="customerGroup.parentId"
            :options="customerGroupsParent"
            autofocus
          />
        </div>
        <div class="p-field p-col-12">
          <label for="description">Mô tả</label>
          <Textarea
            id="description"
            v-model="customerGroup.description"
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
          @click="hideDialog"
        />
        <Button label="Lưu" icon="pi pi-check" @click="saveCustomer">
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Them moi va cap nhat nhom khach hang  -->

    <!-- Dialog Xoa 1 khach hang -->
    <Dialog
      :visible.sync="isOpenDelDialog"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="customerGroup"
          >Bạn chắc chắn muốn xoá <b>{{ customerGroup.name }}</b
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
          @click="deleteSelectedCustomerGroup()"
        >
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Xoa 1 khach hang -->

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
      customerGroup: {},
    };
  },

  created() {
    this.getCustomerGroups();
  },

  computed: {
    ...mapState({
      customerGroups: (state) => state.customerGroup.customerGroups,
      customerGroupsParent: (state) => state.customerGroup.customerGroups,
      statusCreate: (state) => state.customerGroup.status.create,
      statusUpdate: (state) => state.customerGroup.status.update,
      statusDelete: (state) => state.customerGroup.status.delete,
      isLoading: (state) => state.customerGroup.isLoading,
      isLoadingButton: (state) => state.customerGroup.isLoadingButton,
    }),
  },

  methods: {
    ...mapActions({
      getCustomerGroups: "customerGroup/fetchAll",
      getCustomerGroup: "customerGroup/fetchById",
      createCustomerGroup: "customerGroup/create",
      updateCustomerGroup: "customerGroup/update",
      deleteCustomerGroup: "customerGroup/delete",
    }),

    async saveCustomer() {
      this.submitted = true;

      if (this.customerGroup.name) {
        if (this.customerGroup.parentId) {
          this.customerGroup.parentId = this.customerGroup.parentId.id;
        }
        if (this.customerGroup.id) {
          const payload = this.customerGroup;
          await this.updateCustomerGroup(payload);
          if (this.statusUpdate) {
            this.showToast("success", "update");
          } else {
            this.showToast("error", "update");
          }
        } else {
          const payload = this.customerGroup;
          await this.createCustomerGroup(payload);
          if (this.statusCreate) {
            this.showToast("success", "create");
          } else {
            this.showToast("error", "create");
          }
        }

        this.isOpenNewDialog = false;
        this.customerGroup = {};
      }
    },

    async deleteSelectedCustomerGroup() {
      const { id } = this.customerGroup;
      const payload = { ids: [id] };
      await this.deleteCustomerGroup(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.isOpenDelDialog = false;
      this.customerGroup = {};
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

    formatStatus(value) {
      if (value) return "Đang theo dõi";
      else return "Ngừng theo dõi";
    },

    openNew() {
      this.titleDialog = "Thêm mới nhóm khách hàng";
      this.customerGroup = {};
      this.submitted = false;
      this.isOpenNewDialog = true;
    },

    openEdit(customerGroup) {
      this.titleDialog = "Cập nhật thông tin nhóm khách hàng";
      this.customerGroup = { ...customerGroup };
      this.isOpenNewDialog = true;
    },

    openDelete(customerGroup) {
      this.titleDialog = "Cảnh báo !";
      this.customerGroup = customerGroup;
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
@import "./public/assets/sass/custom/pages/customer-group";
</style>
