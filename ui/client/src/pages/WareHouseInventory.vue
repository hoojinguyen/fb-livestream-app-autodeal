<template>
  <div class="warehouse-inventory-container">
    <div class="inventory-wrapper">
      <DataTable
        ref="dt"
        :loading="isLoading"
        :value="inventories"
        :selection.sync="selectedInventory"
        :rows="20"
        :scrollable="true"
        selectionMode="single"
        scrollHeight="730px"
        dataKey="id"
      >
        <template #header>
          <div class="table-header">
            <Button
              label="Lấy dữ liệu"
              icon="pi pi-filter"
              class="p-button-outlined p-mr-2"
              @click="refreshData()"
            />
            <Button
              label="Xuất khẩu"
              icon="pi pi-cloud-download"
              class="p-button-outlined"
              @click="exportCSV($event)"
            />
          </div>
        </template>
        <Column field="sku" header="Mã SKU"> </Column>
        <Column field="name" header="Tên hàng hoá"></Column>
        <Column field="unit.name" header="Đơn vị tính"></Column>
        <Column field="category.name" header="Nhóm hàng hoá"> </Column>
        <!-- <Column field="warehouse" header="Kho"> </Column> -->
        <Column field="stock" header="SL tồn">
          <template #body="slotProps">
            <span>{{ getStockInventory(slotProps.data) }}</span>
          </template>
        </Column>
        <Column field="stockImport" header="SL nhập"> </Column>
        <Column field="stockExport" header="SL xuất"> </Column>
        <Column field="stockOrder" header="SL khách đặt"> </Column>

        <template #empty>
          <div style="text-align: center">
            <p class="p-mt-2">Chưa có dữ liệu ...</p>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      selectedInventory: null,
    };
  },

  created() {
    this.getInventories();
  },

  computed: {
    ...mapState({
      inventories: (state) => state.warehouseInventory.inventories,
      isLoading: (state) => state.warehouseInventory.isLoading,
    }),
  },
  methods: {
    ...mapActions({
      getInventories: "warehouseInventory/fetchAll",
    }),

    refreshData() {
      return this.getInventories();
    },

    exportCSV() {
      this.$refs.dt.exportCSV();
    },

    getStockInventory({ stockImport, stockExport }) {
      return stockImport > stockExport
        ? stockImport - stockExport
        : stockExport - stockImport;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/warehouse-inventory";
</style>
