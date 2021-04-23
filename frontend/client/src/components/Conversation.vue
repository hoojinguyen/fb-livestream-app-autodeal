<template>
  <div class="sale-conversation vld-parent" ref="messageConversation">
    <template v-if="conversation">
      <div class="sale-conversation__header">
        <span>{{ conversation.user }}</span>
        <div class="sale-conversation__header__right">
          <span class="status-connect" v-if="isConnected">Đã kết nối</span>
          <span class="status-disconnect" v-else>Mất kết nối</span>
          <template v-if="isConnected">
            <span
              class="refresh-connect p-pl-3"
              v-tooltip.top="'Ngắt kết nối'"
              @click="actionDisconnect()"
              ><i class="pi pi-times"></i
            ></span>
          </template>
          <template v-else>
            <span
              class="refresh-connect"
              v-tooltip.top="'Kết nối'"
              @click="actionConnectMessage()"
              ><i class="pi pi-replay"></i
            ></span>
          </template>
        </div>
      </div>
      <div class="sale-conversation__body" v-chat-scroll>
        <ConversationChat :messages="conversation.messages" />
      </div>
      <div class="sale-conversation__footer">
        <InputChat :wl="75" :wr="25" @send-message="actionSendMessage" />
      </div>
    </template>
    <template v-else>
      <div class="sale-conversation__yet">
        <div class="sale-conversation__yet__center">
          <img
            width="156px"
            src="assets/layout/images/misa/ic_Khong_Tin_Nhan0.svg"
          />
          <p class="p-mt-2">CHƯA CHỌN HỘI THOẠI</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import InputChat from "@/components/InputChat.vue";
import ConversationChat from "@/components/ConversationChat.vue";
export default {
  components: { InputChat, ConversationChat },

  props: {
    loading: { type: Boolean, default: false },
    conversation: { type: Object, default: null },
    isConnected: { type: Boolean, default: false },
  },

  data() {
    return {
      idImg: "104048917872529",
      loader: null,
    };
  },

  watch: {
    loading(value) {
      if (value) {
        this.loader = this.$loading.show({
          width: 54,
          height: 54,
          opacity: 1,
          loader: "spinner",
          color: "#56A3ED",
          container: this.$refs.messageConversation,
        });
      } else {
        this.loader.hide();
      }
    },
  },

  methods: {
    actionSendMessage(message) {
      this.$emit("send", message);
    },

    actionConnectMessage() {
      this.$emit("connect", this.statusConnect);
    },

    actionDisconnect() {
      this.$emit("connect", true);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/message-conversation";
</style>
