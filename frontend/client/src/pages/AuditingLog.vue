<template>
  <div class="log-container">
    <div class="log">
      <div class="log__header">
        <div class="log__header__left">
          <span>Nhật ký truy cập</span>
        </div>
        <div class="log__header__right">
          <Button
            label="Lấy dữ liệu"
            class="p-button-outlined p-ml-3"
            @click="refreshData()"
          />
        </div>
      </div>
      <div class="log__body vld-parent" ref="tableLog">
        <div class="table">
          <div class="row-item is-header">
            <span class="date">Thời gian</span>
            <span class="user">Người thực hiện</span>
            <span class="action">Hành động</span>
            <span class="description">Mô tả</span>
            <span class="reference">Tham chiếu</span>
          </div>
          <template v-if="logs.length">
            <div class="row-item" v-for="log in logs" :key="log.id">
              <span class="date">{{ log.createdAt | formatDateAndTime }}</span>
              <span class="user">{{ log.userAction }}</span>
              <span class="action">{{ log.action }}</span>
              <span class="description">{{ log.description }}</span>
              <span class="reference">{{ log.reference }}</span>
            </div>
          </template>
          <template v-else>
            <div style="text-align: center; padding-top:20px;">
              <span>Chưa có hoạt động nào ...</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      loader: null,
      loadingSetting: {
        width: 54,
        height: 54,
        opacity: 1,
        loader: "spinner",
        color: "#56A3ED",
      },
    };
  },

  mounted() {
    this.getLogs();
  },

  watch: {
    isLoading(value) {
      if (value) {
        this.loader = this.$loading.show({
          ...this.loadingSetting,
          container: this.$refs.tableLog,
        });
      } else {
        this.loader.hide();
      }
    },
  },

  computed: {
    ...mapState({
      logs: (state) => state.log.logs,
      isLoading: (state) => state.log.isLoading,
    }),
  },

  methods: {
    ...mapActions({
      getLogs: "log/fetchAll",
    }),

    refreshData() {
      this.getLogs();
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/auditing-log";
</style>
