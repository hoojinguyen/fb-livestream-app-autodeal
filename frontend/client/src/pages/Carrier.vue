<template>
  <div class="carrier-management">
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

    <!-- Danh sach đối tác giao hàng -->
    <DataTable
      ref="dt"
      :loading="isLoading"
      :value="carriers"
      :paginator="true"
      :rows="12"
      :scrollable="true"
      scrollHeight="600px"
      :filters="filters"
      dataKey="id"
    >
      <template #header>
        <div class="table-header">
          <h5 class="p-m-0">Danh sách đối tác giao hàng</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global']" placeholder="Tìm kiếm..." />
          </span>
        </div>
      </template>

      <Column field="code" header="Mã đối tác GH"></Column>
      <Column field="name" header="Tên đối tác GH"></Column>
      <Column field="type" header="Loại đối tác">
        <template #body="slotProps">
          <span>
            {{ typeFormat(slotProps.data.type) }}
          </span>
        </template>
      </Column>
      <Column field="service" header="Loại dịch vụ">
        <template #body="slotProps">
          <span>
            {{ typeFormat(slotProps.data.service) }}
          </span>
        </template>
      </Column>
      <Column field="phone" header="Điện thoại"></Column>
      <Column field="address" header="Địa chỉ"></Column>
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
              class="p-button-rounded p-button-warning p-mr-2"
              @click="openDelete(slotProps.data)"
            />
            <Button
              label="Kết nối"
              class="p-button-outlined p-ml-2 p-mt-4"
              @click="openConnect(slotProps.data)"
              v-if="slotProps.data.stopTracking"
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
    <!-- Danh sach đối tác giao hàng -->

    <!-- Dialog Them moi va cap nhat đối tác giao hàng  -->
    <Dialog
      :visible.sync="isOpenNewDialog"
      :style="{ width: '700px' }"
      :header="titleDialog"
      :modal="true"
      class="p-fluid dialog-new"
    >
      <!-- Thong tin co ban -->
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="code">Mã đối tác GH</label>
          <InputText
            id="code"
            v-model="carrier.code"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !carrier.code }"
          />
          <small class="p-invalid" v-if="submitted && !carrier.code"
            >Mã đối tác giao hàng không hợp lệ.</small
          >
        </div>
        <div class="p-field p-col-6">
          <label for="name">Tên đối tác GH</label>
          <InputText
            id="name"
            v-model="carrier.name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !carrier.name }"
          />
          <small class="p-invalid" v-if="submitted && !carrier.name"
            >Tên đối tác giao hàng không hợp lệ.</small
          >
        </div>

        <div class="p-field p-col-6">
          <label>Loại đối tác</label>
          <div class="p-grid">
            <div
              v-for="type of typies"
              :key="type"
              class="p-field-radiobutton p-col-6 p-mt-3"
            >
              <RadioButton
                :id="type"
                :value="type"
                name="type"
                v-model="carrier.type"
              />
              <label :for="type">{{ typeFormat(type) }}</label>
            </div>
          </div>
          <small class="p-invalid" v-if="submitted && !carrier.type"
            >Chưa chọn loại đối tác.
          </small>
        </div>

        <div class="p-field p-col-6">
          <label>Loại dịch vụ</label>
          <div class="p-grid">
            <div
              v-for="service of servicies"
              :key="service"
              class="p-field-radiobutton p-col-6 p-mt-3"
            >
              <RadioButton
                :id="service"
                :value="service"
                name="service"
                v-model="carrier.service"
              />
              <label :for="service">{{ typeFormat(service) }}</label>
            </div>
          </div>
          <small class="p-invalid" v-if="submitted && !carrier.service"
            >Chưa chọn loại dịch vụ.
          </small>
        </div>

        <div class="p-field p-col-6">
          <label for="phone">Điện thoại</label>
          <InputText
            id="phone"
            v-model="carrier.phone"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !carrier.phone }"
          />
          <small class="p-invalid" v-if="submitted && !carrier.phone"
            >SĐT không hợp lệ.
          </small>
        </div>

        <div class="p-field p-col-6">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="carrier.email"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !carrier.email }"
          />
          <small class="p-invalid" v-if="submitted && !carrier.email"
            >Email không hợp lệ.
          </small>
        </div>

        <div class="p-field p-col-12">
          <label for="phone">Địa chỉ</label>
          <InputText
            id="address"
            v-model="carrier.address"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !carrier.address }"
          />
          <small class="p-invalid" v-if="submitted && !carrier.address"
            >SĐT không hợp lệ.
          </small>
        </div>
        <div class="p-field p-col-12" v-if="isEdit">
          <div class="p-field-checkbox">
            <Checkbox v-model="carrier.stopTracking" :binary="true" />
            <label for="binary">Ngưng theo dõi</label>
          </div>
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
        <Button label="Lưu" icon="pi pi-check" @click="saveCarrier">
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Them moi va cap nhat đối tác giao hàng  -->

    <!-- Dialog Xoa 1 đối tác giao hàng -->
    <Dialog
      :visible.sync="isOpenDelDialog"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="carrier"
          >Bạn chắc chắn muốn xoá <b>{{ carrier.name }}</b
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
          @click="deleteSelectedCarrier()"
        >
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Xoa 1 đối tác giao hàng -->

    <!-- Dialog ket noi voi doi tac giao hang -->
    <Dialog
      :visible.sync="isOpenConnectDialog"
      :style="{ width: '350px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12">
          <label for="token">Nhập token:</label>
          <InputText
            id="token"
            v-model="carrierConnect.token"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !carrierConnect.token }"
          />
          <small class="p-invalid" v-if="submitted && !carrierConnect.token"
            >Token không hợp lệ.</small
          >
        </div>
      </div>

      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="isOpenConnectDialog = false"
        />
        <Button label="Đồng ý" icon="pi pi-check" @click="connectWithCarrier" />
      </template>
    </Dialog>
    <!-- Dialog ket noi voi doi tac giao hang -->

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
      carrier: {},
      carrierConnect: {},
      filters: {},
      submitted: false,
      stopTracking: false,
      titleDialog: "",
      typies: ["company", "personal"],
      servicies: ["express", "standard"],
    };
  },

  created() {
    this.getCarrirers();
  },

  computed: {
    ...mapState({
      carriers: (state) => state.carrier.carriers,
      statusCreate: (state) => state.carrier.status.create,
      statusUpdate: (state) => state.carrier.status.update,
      statusDelete: (state) => state.carrier.status.delete,
      isLoading: (state) => state.carrier.isLoading,
      isLoadingButton: (state) => state.carrier.isLoadingButton,
    }),
  },

  methods: {
    ...mapActions({
      getCarrirers: "carrier/fetchAll",
      getCarrier: "carrier/fetchById",
      createCarrier: "carrier/create",
      updateCarrier: "carrier/update",
      deleteCarrier: "carrier/delete",
    }),

    async saveCarrier() {
      this.submitted = true;

      if (this.carrier.name) {
        if (this.carrier.id) {
          const payload = this.carrier;
          await this.updateCarrier(payload);
          if (this.statusUpdate) {
            this.showToast("success", "update");
          } else {
            this.showToast("error", "update");
          }
        } else {
          const payload = this.carrier;
          await this.createCarrier(payload);
          if (this.statusCreate) {
            this.showToast("success", "create");
          } else {
            this.showToast("error", "create");
          }
        }

        this.carrier = {};
        this.isOpenNewDialog = false;
      }
    },

    async deleteSelectedCarrier() {
      const { id } = this.carrier;
      const payload = { ids: [id] };
      await this.deleteCarrier(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.carrier = {};
      this.isOpenDelDialog = false;
    },

    async connectWithCarrier() {
      this.submitted = true;

      if (this.carrierConnect.token) {
        this.isOpenConnectDialog = false;
        this.carrierConnect = {};
        // goi api connect voi ben doi tac giao hang qua ma token
      }
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

    typeFormat(type) {
      if (type == "company") return "Tổ chức";
      else if (type == "personal") return "Cá nhân";
      else if (type == "express") return "GH nhanh";
      else if (type == "standard") return "GH tiêu chuẩn";
    },

    openNew() {
      this.titleDialog = "Thêm mới đối tác giao hàng";
      this.carrier = {};
      this.submitted = false;
      this.isOpenNewDialog = true;
    },

    openEdit(carrier) {
      this.titleDialog = "Cập nhật thông tin đối tác giao hàng";
      this.carrier = { ...carrier };
      this.isOpenNewDialog = true;
      this.isEdit = true;
    },

    openDelete(carrier) {
      this.titleDialog = "Cảnh báo !";
      this.carrier = carrier;
      this.isOpenDelDialog = true;
    },

    async openConnect(carrier) {
      if (carrier.type != "company") {
        const payload = { id: carrier.id, stopTracking: false };
        await this.updateCarrier(payload);
      } else {
        this.titleDialog = `Đối tác: ${carrier.name}`;
        this.carrierConnect = carrier;
        this.isOpenConnectDialog = true;
      }
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
@import "./public/assets/sass/custom/pages/carrier";
</style>
