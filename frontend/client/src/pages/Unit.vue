<template>
  <div class="unit-management">
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

    <!-- Danh sach đơn vị tính -->
    <DataTable
      ref="dt"
      :loading="isLoading"
      :value="units"
      :paginator="true"
      :rows="12"
      :filters="filters"
      :scrollable="true"
      scrollHeight="600px"
      dataKey="id"
    >
      <template #header>
        <div class="table-header">
          <h5 class="p-m-0">Danh sách Đơn vị tính</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global']" placeholder="Tìm kiếm..." />
          </span>
        </div>
      </template>

      <Column field="name" header="Đơn vị tính" :sortable="true"></Column>
      <Column field="description" header="Diễn giải" :sortable="true"></Column>
      <Column field="status" header="Trạng thái" :sortable="true">
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
          <template v-if="!slotProps.data.isDefault">
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
        </template>
      </Column>
      <template #empty>
        <div style="text-align: center">
          <p class="p-mt-2">Chưa có dữ liệu ...</p>
        </div>
      </template>
    </DataTable>
    <!-- Danh sach đơn vị tính -->

    <!-- Dialog Them moi va cap nhat đơn vị tính  -->
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
          <label for="name">Đơn vị tính</label>
          <InputText
            id="name"
            v-model="unit.name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !unit.name }"
          />
          <small class="p-invalid" v-if="submitted && !unit.name"
            >Đơn vị tính không hợp lệ.</small
          >
        </div>
        <div class="p-field p-col-12">
          <label for="description">Mô tả</label>
          <Textarea
            id="description"
            v-model="unit.description"
            rows="3"
            cols="20"
          />
        </div>
        <!-- <div class="p-field p-col-12" v-if="isEdit">
          <div class="p-field-checkbox">
            <Checkbox v-model="stopTracking" :binary="true" />
            <label for="binary">Ngưng theo dõi</label>
          </div>
        </div> -->
      </div>
      <!-- Thong tin co ban -->

      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button label="Lưu" icon="pi pi-check" @click="saveUnit">
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Them moi va cap nhat đơn vị tính  -->

    <!-- Dialog Xoa 1 đơn vị tính -->
    <Dialog
      :visible.sync="isOpenDelDialog"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="unit"
          >Bạn chắc chắn muốn xoá <b>{{ unit.name }}</b
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
        <Button label="Đồng ý" icon="pi pi-check" @click="deleteSelectedUnit()">
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Xoa 1 đơn vị tính -->

    <Toast style="text-align: left" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      isOpenNewDialog: false,
      isOpenDelDialog: false,
      isEdit: false,
      filters: {},
      submitted: false,
      stopTracking: false,
      titleDialog: "",
      unit: {},
    };
  },

  created() {
    this.getUnits();
  },

  computed: {
    ...mapState({
      units: (state) => state.unit.units,
      statusCreate: (state) => state.unit.status.create,
      statusUpdate: (state) => state.unit.status.update,
      statusDelete: (state) => state.unit.status.delete,
      isLoading: (state) => state.unit.isLoading,
      isLoadingButton: (state) => state.unit.isLoadingButton,
    }),
  },

  methods: {
    ...mapActions({
      getUnits: "unit/fetchAll",
      getUnit: "unit/fetchById",
      createUnit: "unit/create",
      updateUnit: "unit/update",
      deleteUnit: "unit/delete",
    }),

    async saveUnit() {
      this.submitted = true;

      if (this.unit.name) {
        if (this.unit.id) {
          const payload = this.unit;
          await this.updateUnit(payload);
          if (this.statusUpdate) {
            this.showToast("success", "update");
          } else {
            this.showToast("error", "update");
          }
        } else {
          const payload = this.unit;
          await this.createUnit(payload);
          if (this.statusCreate) {
            this.showToast("success", "create");
          } else {
            this.showToast("error", "create");
          }
        }

        this.isOpenNewDialog = false;
        this.unit = {};
      }
    },

    async deleteSelectedUnit() {
      const { id } = this.unit;
      const payload = { ids: [id] };
      await this.deleteUnit(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.unit = {};
      this.isOpenDelDialog = false;
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

    filterStatus(value) {
      const tag = "p-tag p-tag";
      if (value) return `${tag}-success`;
      else return `${tag}-danger`;
    },

    openNew() {
      this.titleDialog = "Thêm mới đơn vị tính";
      this.unit = {};
      this.submitted = false;
      this.isOpenNewDialog = true;
    },

    openEdit(unit) {
      this.titleDialog = "Cập nhật thông tin đơn vị tính";
      this.unit = { ...unit };
      this.isOpenNewDialog = true;
      this.isEdit = true;
    },

    openDelete(unit) {
      this.titleDialog = "Cảnh báo !";
      this.unit = unit;
      this.isOpenDelDialog = true;
    },

    hideDialog() {
      this.isOpenNewDialog = false;
      this.isEdit = false;
      this.submitted = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/unit";
</style>
