export default {
  data() {
    return {
      isOpenPopUpChat: false,
    };
  },

  methods: {
    async sendMessage(message) {
      console.log("sendMessage -> message", message);
      // Mo web socket voi server de chat real time
    },

    async openPopUpChat(data) {
      console.log("🚀 ~ openPopUpChat ~ data", data);
      await this.setLoadingAction(true);
      // Goi api get message conversation
      await this.$store.dispatch("facebook/getMessages", {
        conversationId: "t_951400585391614",
        accessToken: this.pageCurrent.accessToken,
      });
      await this.setLoadingAction(false);

      this.isOpenPopUpChat = true;
    },
  },
};
