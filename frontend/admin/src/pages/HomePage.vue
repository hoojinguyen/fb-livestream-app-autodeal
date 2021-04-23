<template>
  <div class="user-management">
    <DataTable
      ref="dt"
      :loading="isLoading"
      :value="users"
      :paginator="true"
      :rows="12"
      :scrollable="true"
      scrollHeight="600px"
      :filters="filters"
      dataKey="id"
    >
      <template #header>
        <div class="table-header">
          <h5 class="p-m-0">Danh sách người dùng</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global']" placeholder="Tìm kiếm..." />
          </span>
        </div>
      </template>

      <Column field="isLocked" header="Mở/Khoá TK" :sortable="true">
        <template #body="slotProps">
          <Button
            v-if="slotProps.data.isLocked"
            icon="pi pi-lock-open"
            class="p-button-rounded p-button-success"
            v-tooltip.top="'Mở khoá tài khoản'"
            @click="onUnlockUser(slotProps.data.id)"
          />
          <Button
            v-else
            icon="pi pi-lock"
            class="p-button-rounded p-button-danger"
            v-tooltip.top="'Khoá tài khoản'"
            @click="onLockUser(slotProps.data.id)"
          />
        </template>
      </Column>

      <Column field="name" header="Tên người dùng"></Column>
      <Column field="role" header="Quyền truy cập"></Column>
      <Column field="phone" header="SĐT"></Column>
      <Column field="email" header="email"></Column>
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
              Locked
            </template>
          </span>
        </template>
      </Column>

      <Column :exportable="false">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-warning p-mr-2"
            v-tooltip.top="'Xoá người dùng'"
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

    <Dialog
      :visible.sync="isOpenDelDialog"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="user"
          >Bạn chắc chắn muốn xoá <b>{{ user.name }}</b
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
        <Button label="Đồng ý" icon="pi pi-check" @click="deleteSelectedUser()">
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>

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
      isOpenConnectDialog: false,
      isEdit: false,
      user: {},
      userConnect: {},
      filters: {},
      submitted: false,
      stopTracking: false,
      titleDialog: "",
      typies: ["company", "personal"],
      servicies: ["express", "standard"],
    };
  },

  mounted() {
    this.getUsers();
  },

  computed: {
    ...mapState({
      users: (state) => state.user.users,
      statusDelete: (state) => state.user.status.delete,
      isLoading: (state) => state.user.isLoading,
      isLoadingButton: (state) => state.user.isLoadingButton,
    }),
  },

  methods: {
    ...mapActions({
      getUsers: "user/fetchAll",
      deleteUser: "user/delete",
      lockUser: "user/lockUser",
      unlockUser: "user/unlockUser",
    }),

    async onLockUser(id) {
      await this.lockUser({ id });
      await this.getUsers();
    },

    async onUnlockUser(id) {
      await this.unlockUser({ id });
      await this.getUsers();
    },

    async deleteSelectedUser() {
      const { id } = this.user;
      const payload = { ids: [id] };
      await this.deleteUser(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.user = {};
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

    openDelete(user) {
      this.titleDialog = "Cảnh báo !";
      this.user = user;
      this.isOpenDelDialog = true;
    },
  },
};
</script>

<style scoped lang="scss">
.user-management {
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: calc(100vh - 130px);
  min-height: calc(100vh - 130px);

  .table-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    h5 {
      font-weight: bold;
      padding-top: 10px;
    }
  }

  .dialog-new {
    .title {
      text-decoration: underline;
    }
  }
}
</style>
