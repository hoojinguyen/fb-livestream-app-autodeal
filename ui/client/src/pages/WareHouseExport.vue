<template>
  <div class="warehouse-import-container">
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
        @row-expand="onRowExpand"
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
        <Column field="code" header="Số phiếu xuất"></Column>
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
            v-if="slotProps.data.details && slotProps.data.details.length"
          >
            <DataTable
              :value="slotProps.data.details"
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
              <Column field="variant.sku" header="Mã SKU"></Column>
              <Column field="variant.name" header="Tên hàng hoá"></Column>
              <!-- <Column field="warehouse" header="Kho"></Column> -->
              <Column field="unit.name" header="Đơn vị tính"></Column>
              <Column field="quantity" header="Số lượng"></Column>
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
          <label for="codeReceipt">Số phiếu xuất</label>
          <InputText
            id="codeReceipt"
            v-model="receipt.code"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !receipt.code }"
          />
          <small class="p-invalid" v-if="submitted && !receipt.code"
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
        :value="listDetails"
        :editingRows.sync="edittingRowProducts"
        dataKey="id"
        editMode="row"
        @row-edit-init="onRowEditInit"
        @row-edit-save="onRowEditSave"
        @row-edit-cancel="onRowEditCancel"
      >
        <template #header>
          <div class="p-grid">
            <div class="p-col-6">
              <Dropdown
                :options="variants"
                v-model="formDetails.variant"
                optionLabel="name"
                placeholder="Mã - Tên hàng hoá"
                autofocus
              />
            </div>
            <div class="p-col-2">
              <Dropdown
                :options="units"
                v-model="formDetails.unit"
                optionLabel="name"
                placeholder="Đơn vị tính"
                autofocus
              />
            </div>
            <div class="p-col-2">
              <InputText
                type="number"
                placeholder="Số lượng "
                v-model="formDetails.quantity"
                required="true"
                autofocus
              />
            </div>
            <div class="p-col-2">
              <Button
                label="Thêm mới"
                icon="pi pi-check"
                class="p-button-success"
                @click="addDetailReceipt()"
              />
            </div>
          </div>
        </template>
        <Column field="variant.sku" header="Mã SKU"> </Column>
        <Column field="variant.name" header="Tên hàng hoá"> </Column>
        <!-- 
        <Column field="warehouse" header="Kho">
          <template #editor="slotProps">
            <InputText v-model="slotProps.data.warehouse" />
          </template>
        </Column> -->
        <Column field="unit.name" header="Đơn vị tính"> </Column>
        <Column field="quantity" header="Số lượng">
          <template #editor="slotProps">
            <InputText type="number" v-model="slotProps.data.quantity" />
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
              @click="removedetailReceipt(slotProps.data)"
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

    <!-- Dialog Xoa Phieu xuat kho -->
    <Dialog
      :visible.sync="isOpenDelDialog"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="receipt"
          >Bạn chắc chắn muốn xoá <b>{{ receipt.code }}</b
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
          @click="deleteSelectedReceipt()"
        >
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Xoa Phieu xuat kho -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getRandomInt, deepClone, omitObject } from "@/utils";

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
        code: "",
        instant: {},
        description: "",
      },
      formDetails: {},
      listDetails: [],
      listDetailsNew: [],
      listDetailsUpdate: [],
      listDetailsDelete: [],
      originalRowsVariantsInReceipt: {},
      edittingRowProducts: [],
      isEditReceipt: false,
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
      receipts: (state) => state.warehouseExport.receipts,
      receiptInStore: (state) => state.warehouseExport.receipt,
      receiptDetails: (state) => state.warehouseExport.receiptDetails,
      statusCreate: (state) => state.warehouseExport.status.create,
      statusUpdate: (state) => state.warehouseExport.status.update,
      statusDelete: (state) => state.warehouseExport.status.delete,
      isLoading: (state) => state.warehouseExport.isLoading,
      isLoadingButton: (state) => state.warehouseExport.isLoadingButton,
      instants: (state) => state.warehouseExport.instants,
      variants: (state) => state.variant.variants,
      units: (state) => state.unit.units,
    }),
  },
  methods: {
    ...mapActions({
      getReceipts: "warehouseExport/fetchReceipts",
      getReceipt: "warehouseExport/fetchReceiptById",
      createReceipt: "warehouseExport/createReceipt",
      createDetails: "warehouseExport/createDetails",
      updateReceipt: "warehouseExport/updateReceipt",
      updateDetails: "warehouseExport/updateDetails",
      deleteReceipt: "warehouseExport/deleteReceipt",
      deleteDetails: "warehouseExport/deleteDetails",
      getInstants: "warehouseExport/fetchInstants",
      getReceiptDetails: "warehouseExport/fetchDetails",
      getVariants: "variant/fetchAll",
      getUnits: "unit/fetchAll",
    }),

    refreshData() {
      this.getReceipts();
    },

    async saveReceipt() {
      this.submitted = true;
      let isSuccess = false;

      if (this.receipt.code) {
        const payloadReceipt = await this.fnCleanReceipt(this.receipt);

        if (this.receipt.id) {
          await this.updateReceipt(payloadReceipt);
          if (this.statusUpdate) {
            let payload = null;
            if (this.listDetailsNew.length) {
              payload = {
                id: this.receipt.id,
                details: this.fnCleanDetails(this.listDetailsNew),
              };
              await this.createDetails(payload);
            }
            if (this.listDetailsUpdate.length) {
              payload = { details: this.listDetailsUpdate };
              await this.updateDetails(payload);
            }
            if (this.listDetailsDelete.length) {
              payload = { ids: this.listDetailsDelete };
              await this.deleteDetails(payload);
            }
            isSuccess = true;
          }

          if (isSuccess) {
            this.showToast("success", "update");
          } else {
            this.showToast("error", "update");
          }
        } else {
          await this.createReceipt(payloadReceipt);
          if (this.statusCreate) {
            if (this.receiptInStore && this.receiptInStore.id) {
              const payloadDetails = {
                id: this.receiptInStore.id,
                details: this.fnCleanDetails(this.listDetails),
              };
              await this.createDetails(payloadDetails);
            }
            isSuccess = true;
          }

          if (isSuccess) {
            this.showToast("success", "create");
          } else {
            this.showToast("error", "create");
          }
        }

        this.receipt = deepClone(this.receiptDefault);
        this.formDetails = {};
        this.listDetails = [];
        this.listDetailsNew = [];
        this.listDetailsUpdate = [];
        this.listDetailsDelete = [];
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

    fnCleanReceipt(receipt) {
      return omitObject(receipt, ["details"]);
    },

    fnCleanDetails(listDetails) {
      const omitFields = ["variant", "unit", "index"];
      let details = deepClone(listDetails);
      details = details.map((el) => omitObject(el, omitFields));
      return details;
    },

    addDetailReceipt() {
      const { quantity, variant, unit } = this.formDetails;

      const fnCheck = quantity && variant && unit ? true : false;
      if (!fnCheck) return;

      const index = getRandomInt(1, 500);
      let payload = {
        variant,
        unit,
        index,
        quantity,
        unitId: unit.id,
        variantId: variant.id,
      };
      this.listDetails.push(payload);

      if (this.isEditReceipt) {
        this.listDetailsNew.push(payload);
      }

      this.formDetails = {};
    },

    removedetailReceipt(detail) {
      const { listDetails } = this;
      if (detail.index) {
        this.listDetails = listDetails.filter((el) => el.index != detail.index);
      } else {
        this.listDetails = listDetails.filter((el) => el.id != detail.id);
      }

      if (this.isEditReceipt) {
        this.listDetailsDelete.push(detail.id);
      }
    },

    openNew() {
      this.titleDialog = "Thêm mới phiếu xuất kho";
      this.receipt = deepClone(this.receiptDefault);
      this.submitted = false;
      this.isOpenNewDialog = true;
      this.isEditReceipt = false;
    },

    async openEdit(receipt) {
      await this.getReceiptDetails({ id: receipt.id });
      this.listDetails = deepClone(this.receiptDetails);
      this.titleDialog = "Cập nhật phiếu xuất kho";
      this.receipt = deepClone({ ...receipt });
      this.isEditReceipt = true;
      this.isOpenNewDialog = true;
    },

    openDelete(receipt) {
      console.log("🚀 ~ openDelete ~ receipt", receipt);
      this.titleDialog = "Cảnh báo !";
      this.receipt = receipt;
      this.isOpenDelDialog = true;
    },

    hideDialog() {
      this.isOpenNewDialog = false;
      this.submitted = false;
    },

    async onRowExpand(e) {
      await this.getReceiptDetails({ id: e.data.id });
    },

    onRowEditInit(event) {
      this.originalRowsVariantsInReceipt[event.index] = {
        ...this.listDetails[event.index],
      };
    },

    onRowEditCancel(event) {
      this.listDetails[event.index] = this.originalRowsVariantsInReceipt[
        event.index
      ];
    },

    onRowEditSave(event) {
      if (this.isEditReceipt) {
        const { id, unitId, variantId, quantity } = event.data;
        this.listDetailsUpdate.push({ id, unitId, variantId, quantity });
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

    async printReport(receipt) {
      let details = null;
      if (receipt.details) {
        details = receipt.details;
      } else {
        await this.getReceiptDetails({ id: receipt.id });
        details = deepClone(this.receiptDetails);
      }

      let rows = "";
      details.map(({ variant, unit, quantity }) => {
        rows += `
                <tr>
                  <td>${variant.sku}</td>
                  <td>${variant.name}</td>
                  <td>${unit.name}</td>
                  <td>${quantity}</td>
                </tr>
              `;
      });

      let table = `
      <table class="table">
        <thead>
          <tr>
            <th>Mã SKU</th>
            <th>Tên hàng hoá</th>
            <th>Đơn vị tính</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
      </table>`;

      let delivery = "................................";
      let description = "................................";
      let instant = "................................";
      if (receipt.delivery) delivery = receipt.delivery;
      if (receipt.description) description = receipt.description;
      if (receipt.instant) instant = receipt.instant.title;

      delivery = `<p>Người giao: ${delivery}</p>`;
      instant = `<p>Đối tượng: ${instant}</p>`;
      description = `<p>Diễn giải: ${description}</p>`;

      let title = `<h3>Phiếu xuất kho</h3>`;
      let code = `Số: ${receipt.code}`;

      let newWin = window.open("");
      newWin.document.write(
        `<html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>` +
          `<style>
            table, td, th {
              border: 1px solid black;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
          </style>` +
          `<body>` +
          `<div class="container">` +
          title +
          code +
          instant +
          delivery +
          description +
          table +
          `</div>` +
          `</body>` +
          `</html>`
      );
      newWin.document.close();
      newWin.print();
      newWin.close();
      return false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/warehouse-import";
</style>
