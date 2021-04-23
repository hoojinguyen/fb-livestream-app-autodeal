<template>
  <div class="customer-management">
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
          :disabled="!selectedCustomers || !selectedCustomers.length"
        >
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Toolbar>
    <!-- Cac button them moi , xoa  -->

    <!-- Danh sach san pham -->
    <DataTable
      ref="dt"
      :loading="isLoading"
      :value="customers"
      :selection.sync="selectedCustomers"
      :paginator="true"
      :rows="12"
      :filters="filters"
      :scrollable="true"
      scrollHeight="600px"
      dataKey="id"
      class="p-datatable-gridlines"
    >
      <template #header>
        <div class="table-header">
          <h5 class="p-m-0">Danh sách khách hàng</h5>
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
      <Column field="code" header="Mã khách hàng" :sortable="true"></Column>
      <Column field="name" header="Tên khách hàng" :sortable="true"></Column>
      <Column field="group.name" header="Nhóm khách hàng" :sortable="true">
        <template #body="slotProps">
          <span v-if="slotProps.data.customerGroup">{{
            slotProps.data.customerGroup.name
          }}</span>
          <span v-else></span>
        </template>
      </Column>
      <Column field="phone" header="Điện thoại" :sortable="true">
        <template #body="slotProps">
          <span v-if="slotProps.data.phone">{{ slotProps.data.phone }}</span>
          <span v-else></span> </template
      ></Column>

      <Column field="email" header="Email" :sortable="true">
        <template #body="slotProps">
          <span v-if="slotProps.data.email">{{ slotProps.data.email }}</span>
          <span v-else></span> </template
      ></Column>
      <Column field="address" header="Địa chỉ" :sortable="true">
        <template #body="slotProps">
          <span v-if="slotProps.data.address">{{
            slotProps.data.address
          }}</span>
          <span v-else></span> </template
      ></Column>
      <!-- <Column field="province" header="Tỉnh thành" :sortable="true">
        <template #body="slotProps">
          <span v-if="slotProps.data.province">{{
            slotProps.data.province
          }}</span>
          <span v-else></span> </template
      ></Column>
      <Column field="district" header="Quận/Huyện" :sortable="true">
        <template #body="slotProps">
          <span v-if="slotProps.data.district">{{
            slotProps.data.district
          }}</span>
          <span v-else></span> </template
      ></Column>
      <Column field="ward" header="Phường/Xã" :sortable="true">
        <template #body="slotProps">
          <span v-if="slotProps.data.ward">{{ slotProps.data.ward }}</span>
          <span v-else></span> </template
      ></Column> -->
      <!-- <Column field="street" header="Số nhà, đường phố" :sortable="true">
        <template #body="slotProps">
          <span v-if="slotProps.data.street">{{ slotProps.data.street }}</span>
          <span v-else></span>
        </template>
      </Column> -->
      <Column field="birthday" header="Ngày sinh" :sortable="true">
        <template #body="slotProps">
          <span v-if="slotProps.data.birthday">{{
            slotProps.data.birthday | formatDate()
          }}</span>
          <span v-else></span> </template
      ></Column>

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
    <!-- Danh sach san pham -->

    <!-- Dialog Them moi va cap nhat customer  -->
    <Dialog
      :visible.sync="isOpenNewDialog"
      :style="{ width: '600px' }"
      :header="titleDialog"
      :modal="true"
      class="p-fluid dialog-new"
    >
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="code">Mã khách hàng</label>
          <InputText id="code" v-model="customer.code" autofocus />
          <!-- required="true"
            :class="{ 'p-invalid': submitted && !customer.code }"
          <small class="p-invalid" v-if="submitted && !customer.code">
            Mã khách hàng không hợp lệ.
          </small> -->
        </div>

        <div class="p-field p-col-6">
          <label for="name">Tên khách hàng</label>
          <InputText
            id="name"
            v-model="customer.name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.name }"
          />
          <small class="p-invalid" v-if="submitted && !customer.name"
            >Tên khách hàng không hợp lệ.
          </small>
        </div>

        <div class="p-field p-col-6">
          <label for="customerGroups">Nhóm khách hàng</label>
          <Dropdown
            id="customerGroups"
            v-model="customer.customerGroupId"
            :options="customerGroups"
            optionLabel="name"
            placeholder="Chọn nhóm khách hàng"
            autofocus
          />
          <!-- :class="{ 'p-invalid': submitted && !customer.customerGroupId }" -->
          <!-- required="true"
          <small class="p-invalid" v-if="submitted && !customer.customerGroupId"
            >Nhóm khách hàng không hợp lệ.
          </small> -->
        </div>

        <div class="p-field p-col-6">
          <label for="dateformat">Ngày sinh</label>
          <Calendar
            dateFormat="dd/mm/yy"
            id="dateformat"
            :showIcon="true"
            v-model="customer.birthday"
            autofocus
          />
          <!-- :class="{ 'p-invalid': submitted && !customer.birthday }" -->
          <!-- <small class="p-invalid" v-if="submitted && !customer.birthday"
            >Ngày sinh không hợp lệ.
          </small> -->
        </div>

        <div class="p-field p-col-6">
          <label for="phone">Điện thoại</label>
          <InputText id="phone" v-model="customer.phone" autofocus />
          <!-- required="true"
            :class="{ 'p-invalid': submitted && !customer.phone }"
          <small class="p-invalid" v-if="submitted && !customer.phone"
            >SĐT không hợp lệ.
          </small> -->
        </div>

        <div class="p-field p-col-6">
          <label for="email">Email</label>
          <InputText id="email" v-model="customer.email" autofocus />
          <!-- required="true"
            :class="{ 'p-invalid': submitted && !customer.email }"
          <small class="p-invalid" v-if="submitted && !customer.email"
            >Email không hợp lệ.
          </small> -->
        </div>

        <div class="p-field p-col-12">
          <label>Giới tính</label>
          <div class="p-grid">
            <div
              v-for="gender of genders"
              :key="gender"
              class="p-field-radiobutton p-col-3 p-mt-3"
            >
              <RadioButton
                :id="gender"
                :value="gender"
                name="gender"
                v-model="customer.gender"
              />
              <label :for="gender">{{ genderFormat(gender) }}</label>
            </div>
          </div>
          <small class="p-invalid" v-if="submitted && !customer.gender"
            >Chưa chọn giới tính.
          </small>
        </div>

        <div class="p-field p-col-12">
          <label for="address">Địa chỉ</label>
          <InputText id="address" v-model="customer.address" autofocus />
          <!-- required="true"
            :class="{ 'p-invalid': submitted && !customer.address }"
          <small class="p-invalid" v-if="submitted && !customer.address"
            >Địa chỉ không hợp lệ.
          </small> -->
        </div>

        <div class="p-field p-col-12">
          <label for="description">Ghi chú</label>
          <Textarea
            id="description"
            v-model="customer.description"
            rows="3"
            cols="20"
          />
        </div>
      </div>

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
    <!-- Dialog Them moi va cap nhat Customer  -->

    <!-- Dialog Xoa 1 Customer -->
    <Dialog
      :visible.sync="isOpenDelDialog"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="customer"
          >Bạn chắc chắn muốn xoá <b>{{ customer.name }}</b
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
          @click="deleteSelectedCustomer"
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
        <span v-if="customer">Bạn có muốn xoá những khách hàng đã chọn?</span>
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
          @click="deleteSelectedCustomers()"
        />
      </template>
    </Dialog>
    <!-- Dialog Xoa nhung san pham da chon -->

    <Toast style="text-align: left" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { omitObject, deepClone } from "@/utils";

export default {
  data() {
    return {
      titleDialog: "",
      isOpenNewDialog: false,
      isOpenDelDialog: false,
      isOpenDelSelectedDialog: false,
      filters: {},
      customer: {},
      selectedCustomers: [],
      submitted: false,
      genders: ["male", "female", "undefine"],
    };
  },

  created() {
    this.getCustomers();
    this.getCustomerGroups();
  },

  computed: {
    ...mapState({
      customers: (state) => state.customer.customers,
      customerGroups: (state) => state.customerGroup.customerGroups,
      statusCreate: (state) => state.customer.status.create,
      statusUpdate: (state) => state.customer.status.update,
      statusDelete: (state) => state.customer.status.delete,
      isLoading: (state) => state.customer.isLoading,
      isLoadingButton: (state) => state.customer.isLoadingButton,
    }),
  },

  methods: {
    ...mapActions({
      getCustomers: "customer/fetchAll",
      getCustomer: "customer/fetchById",
      getCustomerGroups: "customerGroup/fetchAll",
      createCustomer: "customer/create",
      updateCustomer: "customer/update",
      deleteCustomer: "customer/delete",
    }),

    fnCleanCustomer(customer) {
      if (customer.customerGroupId) {
        customer.customerGroupId = customer.customerGroupId.id || null;
      }

      return omitObject(customer, ["customerGroup"]);
    },

    async saveCustomer() {
      this.submitted = true;

      if (this.customer.name) {
        let payload = await this.fnCleanCustomer(this.customer);

        if (this.customer.id) {
          await this.updateCustomer(payload);
          if (this.statusUpdate) {
            this.showToast("success", "update");
          } else {
            this.showToast("error", "update");
          }
        } else {
          await this.createCustomer(payload);
          if (this.statusCreate) {
            this.showToast("success", "create");
          } else {
            this.showToast("error", "create");
          }
        }

        this.isOpenNewDialog = false;
        this.customer = {};
      }
    },

    async deleteSelectedCustomer() {
      const { id } = this.customer;
      const payload = { ids: [id] };
      await this.deleteCustomer(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.customer = {};
      this.isOpenDelDialog = false;
    },

    async deleteSelectedCustomers() {
      const ids = this.selectedCustomers.map((el) => el.id);
      const payload = { ids };
      await this.deleteCustomer(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.selectedCustomers = null;
      this.isOpenDelSelectedDialog = false;
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

    genderFormat(sex) {
      if (sex == "male") return "Nam";
      else if (sex == "female") return "Nữ";
      else if (sex == "undefine") return "Không xác định";
    },

    openNew() {
      this.titleDialog = "Thêm mới khách hàng";
      this.customer = { gender: "male" };
      this.submitted = false;
      this.isOpenNewDialog = true;
    },

    openEdit(customer) {
      console.log("🚀 ~ openEdit ~ customer", customer);
      this.titleDialog = "Chỉnh sửa thông tin khách hàng";
      this.customer = deepClone(customer);
      this.isOpenNewDialog = true;
    },

    openDelete(customer) {
      this.titleDialog = "Cảnh báo !";
      this.customer = customer;
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
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/customer";
</style>
