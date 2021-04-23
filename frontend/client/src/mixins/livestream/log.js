export default {
  data() {
    return {
      isOpenLogActivity: false,
    };
  },

  methods: {
    toggleActivityLog() {
      this.isOpenLogActivity = !this.isOpenLogActivity;
    },

    createLog(data) {
      const {
        isComment,
        comment,
        isCreateOrder,
        customerName,
        isCustom,
        custom,
        isSyntax,
        syntax,
      } = data;
      let title = null;
      let description = null;

      if (isComment) {
        const { message, sender } = comment;
        title = `${sender.name} đã bình luận`;
        description = message;
      } else if (isCreateOrder) {
        title = "Đã tạo mới đơn hàng";
        description = `Tên khách: ${customerName}`;
      } else if (isCustom) {
        title = custom.title;
        description = custom.description;
      } else if (isSyntax) {
        title = "Cú pháp không hợp lệ";
        description = `${syntax} không đúng`;
      }

      let createdAt = new Date();
      createdAt = this.$options.filters.formatDate(createdAt);

      this.addLogs({ title, description, createdAt });
    },
  },
};
