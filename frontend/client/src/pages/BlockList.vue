<template>
  <div class="block-list">
    <DataTable
      :value="customersBlock"
      :loading="loading"
      class="p-datatable-gridlines"
    >
      <template #header>
        <h2 style="text-align: center">Danh sách khách hàng bị báo cáo</h2>
        <!-- <Dropdown
          v-model="selectedFanPage"
          :options="fanPages"
          optionLabel="name"
          placeholder="Chọn Fanpage"
          style="width: 300px"
          @change="onChangeFanPage($event)"
        /> -->
      </template>
      <!-- <Column
        headerStyle="background-color: #DAE3FC"
        bodyStyle="background-color: #F4F7FE"
        field="facebook"
        header="Tên Facebook"
      >
        <template #body="slotProps">
          <span v-if="slotProps.data.facebook">{{
            slotProps.data.facebook.name
          }}</span>
          <span v-else></span>
        </template>
      </Column> -->
      <Column
        headerStyle="background-color: #DAE3FC"
        bodyStyle="background-color: #F4F7FE"
        field="customer.name"
        header="Họ tên"
      ></Column>
      <Column
        headerStyle="background-color: #DAE3FC"
        bodyStyle="background-color: #F4F7FE"
        field="customer.phone"
        header="Số ĐT"
      ></Column>
      <Column
        headerStyle="background-color: #DAE3FC"
        bodyStyle="background-color: #F4F7FE"
        field="customer.email"
        header="Email"
      ></Column>
      <Column
        headerStyle="background-color: #DAE3FC"
        bodyStyle="background-color: #F4F7FE"
        field="count"
        header="Số lần bị báo cáo"
      ></Column>

      <Column
        headerStyle="background-color: #DAE3FC"
        bodyStyle="background-color: #F4F7FE"
        field="reason"
        header="Lý do báo cáo"
      ></Column>
      <!-- <Column
        headerStyle="background-color: #DAE3FC"
        bodyStyle="background-color: #F4F7FE"
        field="reporter.name"
        header="Người báo cáo"
      ></Column> -->
      <Column
        headerStyle="background-color: #DAE3FC"
        bodyStyle="background-color: #F4F7FE"
        field="updatedAt"
        header="Ngày cập nhật"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.updatedAt | formatDate() }}</span>
        </template>
      </Column>
      <Column
        headerStyle="background-color: #DAE3FC"
        bodyStyle="background-color: #F4F7FE; text-align: center"
        :exportable="false"
        style=""
      >
        <template #body="slotProps">
          <Button
            label="Huỷ chặn"
            class="p-button-outlined p-ml-2"
            @click="openCancelBlock(slotProps.data)"
          />
        </template>
      </Column>
      <template #empty>
        <div style="text-align: center">
          <p class="p-mt-2">Chưa có dữ liệu ...</p>
        </div>
      </template>
    </DataTable>

    <!-- Dialog bo chan khach hang -->
    <Dialog
      :visible.sync="isOpenConfirmCancel"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="customerBlock"
          >Bạn chắc chắn muốn bỏ chặn
          <b>{{ customerBlock.customer.name }}</b> ?</span
        >
      </div>
      <template #footer>
        <Button
          label="Không"
          icon="pi pi-times"
          class="p-button-text"
          @click="isOpenConfirmCancel = false"
        />
        <Button label="Có" icon="pi pi-check" @click="confirmCancel" />
      </template>
    </Dialog>
    <!-- Dialog bo chan khach hang -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      selectedFanPage: null,
      customerBlock: null,
      isOpenConfirmCancel: false,
      titleDialog: "",
      loading: false,
    };
  },

  async mounted() {
    await this.setLoading(true);
    await this.getCustomers();
    await this.setLoading(false);
  },

  computed: {
    ...mapState({
      customersBlock: (state) => state.customer.customersBlock,
    }),
  },

  methods: {
    ...mapActions({
      getCustomers: "customer/fetchCustomerBlock",
      cancelBlock: "customer/cancelCustomerBlock",
    }),

    setLoading(value) {
      this.loading = value;
    },

    openCancelBlock(customer) {
      this.titleDialog = "Cảnh báo !";
      this.isOpenConfirmCancel = true;
      this.customerBlock = customer;
    },

    async confirmCancel() {
      await this.setLoading(true);
      await this.cancelBlock({
        ids: [this.customerBlock.id],
      });
      this.isOpenConfirmCancel = false;
      this.customerBlock = null;
      await this.getCustomers();
      await this.setLoading(false);
    },
  },
};
</script>
