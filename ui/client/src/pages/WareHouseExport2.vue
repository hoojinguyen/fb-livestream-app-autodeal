<template>
  <div class="warehouse-export-container">
    <Toast style="text-align: left" />

    <!-- Danh Sach phieu xuat  -->
    <div class="receipts-wrapper">
      <DataTable
        ref="dt"
        :loading="isLoading"
        :value="receipts"
        :rows="10"
        :scrollable="true"
        :expandedRows.sync="expandedRows"
        scrollHeight="730px"
        dataKey="id"
      >
        <template #header>
          <div class="table-header">
            <span class="p-input-icon-left">
              <Button
                label="Thêm mới"
                icon="pi pi-plus"
                class="p-button-success p-mr-2"
                @click="openNew()"
              />
              <Button
                label="Lấy dữ liệu"
                icon="pi pi-filter"
                class="p-button-outlined p-mr-2"
                @click="refreshData()"
              />
            </span>
          </div>
        </template>
        <Column :expander="true" headerStyle="width: 3rem" />
        <Column field="createdAt" header="Ngày xuất">
          <template #body="slotProps">
            <span>{{ slotProps.data.createdAt | formatDate() }}</span>
          </template>
        </Column>
        <Column field="numReceipt" header="Số phiếu xuất"></Column>
        <Column field="instant.name" header="Đối tượng"></Column>
        <Column field="description" header="Diễn giải"> </Column>
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
            <Button
              icon="pi pi-print"
              class="p-button-rounded p-button-secondary p-button-outlined"
              v-tooltip.top="'In phiếu xuất'"
              @click="printReport(slotProps.data)"
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
                  <span class="title-detail">Chi tiết phiếu xuất</span>
                </div>
              </template>
              <Column field="sku" header="Mã SKU"></Column>
              <Column field="name" header="Tên hàng hoá"></Column>
              <Column field="warehouse" header="Kho"></Column>
              <Column field="unit.name" header="Đơn vị tính"></Column>
              <Column field="stock" header="Số lượng"></Column>
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
    </div>
    <!-- Danh Sach phieu xuat  -->

    <!-- Dialog tao moi va cap nhat phieu kho -->
    <Dialog
      :visible.sync="isOpenNewDialog"
      :style="{ width: '50vw' }"
      :header="titleDialog"
      :modal="true"
      class="p-fluid dialog-new"
    >
      <!-- Thong tin chung -->
      <h5 class="title">Thông tin chung:</h5>
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-4">
          <label for="numReceipt">Số phiếu xuất</label>
          <InputText
            id="numReceipt"
            v-model="receipt.numReceipt"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !receipt.numReceipt }"
          />
          <small class="p-invalid" v-if="submitted && !receipt.numReceipt"
            >Số phiếu xuất không hợp lệ.</small
          >
        </div>
        <div class="p-field p-col-4">
          <label for="instantImport">Đối tượng</label>
          <Dropdown
            id="instantImport"
            v-model="receipt.instant"
            :options="instants"
            optionLabel="title"
            placeholder="Đối tượng xuất kho"
            autofocus
          />
        </div>
        <div class="p-field p-col-4">
          <label for="delivery">Người giao</label>
          <InputText
            id="delivery"
            v-model="receipt.delivery"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !receipt.delivery }"
          />
          <small class="p-invalid" v-if="submitted && !receipt.delivery"
            >Người giao không hợp lệ.</small
          >
        </div>

        <div class="p-field p-col-12">
          <label for="description">Diễn giải</label>
          <Textarea
            id="description"
            v-model="receipt.description"
            rows="3"
            cols="20"
          />
        </div>
      </div>
      <!-- Thong tin chung -->

      <!-- Chi tiet -->
      <h5 class="title">Chi tiết:</h5>
      <DataTable
        :value="receipt.variants"
        :editingRows.sync="edittingRowProducts"
        dataKey="id"
        editMode="row"
        @row-edit-init="onRowEditInit"
        @row-edit-cancel="onRowEditCancel"
      >
        <template #header>
          <div class="p-grid">
            <div class="p-col-6">
              <Dropdown
                :options="variants"
                v-model="variantInReceipt.variant"
                optionLabel="name"
                placeholder="Mã - Tên hàng hoá"
                autofocus
              />
            </div>
            <div class="p-col-2">
              <Dropdown
                :options="units"
                v-model="variantInReceipt.unit"
                optionLabel="name"
                placeholder="Đơn vị tính"
                autofocus
              />
            </div>
            <div class="p-col-2">
              <InputText
                type="number"
                placeholder="Số lượng "
                v-model="variantInReceipt.stock"
                required="true"
                autofocus
              />
            </div>
            <div class="p-col-2">
              <Button
                label="Thêm mới"
                icon="pi pi-check"
                class="p-button-success"
                @click="addVariantInReceipt()"
              />
            </div>
          </div>
        </template>
        <Column field="sku" header="Mã SKU"> </Column>
        <Column field="name" header="Tên hàng hoá"> </Column>
        <!-- 
        <Column field="warehouse" header="Kho">
          <template #editor="slotProps">
            <InputText v-model="slotProps.data.warehouse" />
          </template>
        </Column> -->
        <Column field="unit.name" header="Đơn vị tính"> </Column>
        <Column field="stock" header="Số lượng">
          <template #editor="slotProps">
            <InputText type="number" v-model="slotProps.data.stock" />
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
              @click="removeVariantInReceipt(slotProps.data)"
            />
          </template>
        </Column>
        <template #empty>
          <div style="text-align: center">
            <p class="p-mt-2">Chưa có dữ liệu ...</p>
          </div>
        </template>
      </DataTable>
      <!-- Chi tiet -->
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog()"
        />
        <Button label="Lưu" icon="pi pi-check" @click="saveReceipt()">
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog tao moi va cap nhat phieu kho -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getRandomInt, deepClone } from "@/utils";

export default {
  data() {
    return {
      isOpenNewDialog: false,
      isOpenDelDialog: false,
      isOpenDelSelectedDialog: false,
      titleDialog: "",
      expandedRows: [],
      submitted: false,
      filters: {},
      receipt: {},
      receiptDefault: {
        numReceipt: "",
        instant: {},
        description: "",
        variants: [],
      },
      variantInReceipt: {},
      originalRowsVariantsInReceipt: {},
      edittingRowProducts: [],
    };
  },

  created() {
    this.getReceipts();
    this.getVariants();
    this.getUnits();
    this.getInstants();
  },

  computed: {
    ...mapState({
      receipts: (state) => state.warehouse.receipts,
      receiptDetails: (state) => state.warehouse.receipt,
      statusCreate: (state) => state.warehouse.status.create,
      statusUpdate: (state) => state.warehouse.status.update,
      statusDelete: (state) => state.warehouse.status.delete,
      isLoading: (state) => state.warehouse.isLoading,
      isLoadingButton: (state) => state.warehouse.isLoadingButton,
      instants: (state) => state.warehouse.instants,
      variants: (state) => state.variant.variants,
      units: (state) => state.unit.units,
    }),
  },
  methods: {
    ...mapActions({
      getReceipts: "warehouse/fetchReceipt",
      getReceipt: "warehouse/fetchReceiptById",
      createReceipt: "warehouse/createReceipt",
      updateReceipt: "warehouse/updateReceipt",
      deleteReceipt: "warehouse/deleteReceipt",
      getInstants: "warehouse/fetchInstants",
      getVariants: "variant/fetchAll",
      getUnits: "unit/fetchAll",
    }),

    refreshData() {
      this.getReceipts();
    },

    async saveReceipt() {
      this.submitted = true;

      if (this.receipt.numReceipt) {
        const payload = await this.fnCleanReceipt();
        if (this.receipt.id) {
          await this.updateReceipt(payload);
          if (this.statusUpdate) {
            this.showToast("success", "update");
          } else {
            this.showToast("error", "update");
          }
        } else {
          await this.createReceipt(payload);
          if (this.statusCreate) {
            this.showToast("success", "create");
          } else {
            this.showToast("error", "create");
          }
        }

        this.receipt = deepClone(this.receiptDefault);
        this.isOpenNewDialog = false;
        this.submitted = false;
      }
    },

    async deleteSelectedReceipt() {
      const { id } = this.receipt;
      const payload = { ids: [id] };
      await this.deleteReceipt(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.receipt = deepClone(this.receiptDefault);
      this.isOpenDelDialog = false;
    },

    fnCleanReceipt() {
      console.log("Create Receipt ~ Data: ", this.receipt);
      return this.receipt;
    },

    addVariantInReceipt() {
      const { stock, variant, unit } = this.variantInReceipt;

      const fnCheck = stock && variant && unit ? true : false;
      if (!fnCheck) return;

      const index = getRandomInt(1, 500);
      let payload = { ...variant, stock, unit, index };

      this.receipt.variants.push(payload);
      this.variantInReceipt = {};
    },

    removeVariantInReceipt(data) {
      const { variants } = this.receipt;
      if (data.index) {
        this.receipt.variants = variants.filter((el) => el.index != data.index);
      } else {
        this.receipt.variants = variants.filter((el) => el.id != data.id);
      }
    },

    openNew() {
      this.titleDialog = "Thêm mới phiếu xuất kho";
      this.receipt = deepClone(this.receiptDefault);
      this.submitted = false;
      this.isOpenNewDialog = true;
    },

    openEdit(receipt) {
      this.titleDialog = "Cập nhật phiếu xuất kho";
      this.receipt = deepClone({ ...receipt });
      this.isOpenNewDialog = true;
    },

    openDelete(receipt) {
      this.titleDialog = "Cảnh báo !";
      this.receipt = receipt;
      this.isOpenDelDialog = true;
    },

    hideDialog() {
      this.isOpenNewDialog = false;
      this.submitted = false;
    },

    onRowEditInit(event) {
      this.originalRowsVariantsInReceipt[event.index] = {
        ...this.receipt.variants[event.index],
      };
    },

    onRowEditCancel(event) {
      this.receipt.variants[event.index] = this.originalRowsVariantsInReceipt[
        event.index
      ];
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

    printReport(data) {
      console.log("🚀 ~ printReport ~ data", data);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/warehouse-export";
</style>
