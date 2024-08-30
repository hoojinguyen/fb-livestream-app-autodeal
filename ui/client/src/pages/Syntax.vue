<template>
  <div class="syntax-management card">
    <!-- Cac button them moi , xoa  -->
    <Toolbar class="p-mb-4">
      <template slot="left">
        <span
          >Thiết lập cú pháp khách hàng bình luận để hệ thống tự động lấy thông
          tin về đơn hàng</span
        >
      </template>
      <template slot="right">
        <Button
          label="Thêm cú pháp"
          icon="pi pi-plus"
          class="p-button-success p-mr-2"
          @click="openNew"
        />
      </template>
    </Toolbar>
    <!-- Cac button them moi , xoa  -->

    <!-- Danh sach cú pháp -->
    <template v-if="syntaxes.length">
      <div class="syntax-table card">
        <template v-if="isLoading">
          <div style="text-align: center">
            <ProgressSpinner />
          </div>
        </template>
        <template v-else>
          <div class="syntax-row" v-for="item in syntaxes" :key="item.id">
            <div class="syntax-format">
              <span v-for="(el, index) in item.details" :key="index">
                <span class="syntax-text">{{ el }}</span>
                <span
                  v-if="item.details.length !== index + 1"
                  class="syntax-badge-space"
                  >Dấu cách</span
                >
              </span>
            </div>
            <div class="syntax-action">
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text p-button-danger"
                @click="openDelete(item)"
              />
            </div>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="syntax-table-empty">
        <span>
          Chưa thiết lập cú pháp nào !
        </span>
      </div>
    </template>
    <!-- Danh sach cú pháp -->

    <!-- Dialog Them moi va cap nhat cú pháp  -->
    <Dialog
      :visible.sync="syntaxDialog"
      :style="{ width: '400px' }"
      :header="titleDialog"
      :modal="true"
      class="p-fluid dialog-new"
    >
      <!-- Thong tin co ban -->
      <div class="p-fluid p-formgrid p-grid p-mt-3">
        <div class="p-field p-col-12">
          <span v-for="(synt, i) in syntaxForm.details" :key="i">
            <span class="syntax-badge-syntax">{{ synt }}</span>
          </span>
        </div>
      </div>
      <hr />

      <div class="p-fluid">
        <span class="p-mt-2 p-ml-2"> Trường thông tin:</span>
        <div class="p-field p-col-12">
          <SelectButton
            v-model="syntaxForm.details"
            :options="syntaxOptions"
            optionLabel
            multiple
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
        <Button label="Lưu" icon="pi pi-check" @click="saveSyntax()">
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Them moi va cap nhat cú pháp  -->

    <!-- Dialog Xoa 1 cú pháp-->
    <Dialog
      :visible.sync="deleteSyntaxDialog"
      :style="{ width: '450px' }"
      :header="titleDialog"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="syntaxForm">Bạn chắc chắn muốn xoá ?</span>
      </div>
      <template #footer>
        <Button
          label="Huỷ bỏ"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteSyntaxDialog = false"
        />
        <Button
          label="Đồng ý"
          icon="pi pi-check"
          @click="deleteSelectedSyntax()"
        >
          <ProgressSpinner
            style="width: 18px; height: 18px"
            v-if="isLoadingButton"
          />
        </Button>
      </template>
    </Dialog>
    <!-- Dialog Xoa 1 cú pháp-->
    <Toast style="text-align: left" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      syntaxDialog: false,
      deleteSyntaxDialog: false,
      syntaxForm: {
        details: [],
      },
      syntaxOptions: ["Mã hàng hoá", "Số lượng", "SĐT"],
      submitted: false,
      titleDialog: "",
    };
  },

  created() {
    this.getSyntaxes();
  },

  computed: {
    ...mapState({
      syntaxes: (state) => state.syntax.syntaxes,
      statusCreate: (state) => state.syntax.status.create,
      statusUpdate: (state) => state.syntax.status.update,
      statusDelete: (state) => state.syntax.status.delete,
      isLoading: (state) => state.syntax.isLoading,
      isLoadingButton: (state) => state.syntax.isLoadingButton,
    }),
  },

  methods: {
    ...mapActions({
      getSyntaxes: "syntax/fetchAll",
      getSyntax: "syntax/fetchById",
      createSyntax: "syntax/create",
      updateSyntax: "syntax/update",
      deleteSyntax: "syntax/delete",
    }),

    async saveSyntax() {
      this.submitted = true;

      if (this.syntaxForm.details.length) {
        const payload = this.syntaxForm;
        console.log("🚀 ~ saveSyntax ~ payload", payload);
        await this.createSyntax(payload);
        if (this.statusCreate) {
          this.showToast("success", "create");
        } else {
          this.showToast("error", "create");
        }

        this.syntaxDialog = false;
        this.syntaxForm = {};
      }
    },

    async deleteSelectedSyntax() {
      const { id } = this.syntaxForm;
      const payload = { ids: [id] };
      await this.deleteSyntax(payload);
      if (this.statusDelete) {
        this.showToast("success", "delete");
      } else {
        this.showToast("error", "delete");
      }

      this.syntaxForm = {};
      this.deleteSyntaxDialog = false;
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
        life: 3000,
      });
    },

    openNew() {
      this.titleDialog = "Thêm mới cú pháp";
      this.syntaxForm = { details: [] };
      this.submitted = false;
      this.syntaxDialog = true;
    },

    openDelete(syntax) {
      this.titleDialog = "Cảnh báo !";
      this.syntaxForm = syntax;
      this.deleteSyntaxDialog = true;
    },

    hideDialog() {
      this.syntaxDialog = false;
      this.submitted = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/syntax";
</style>
