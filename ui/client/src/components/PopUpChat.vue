<template>
  <div class="popup-chat-mask" v-if="visible">
    <div class="popup-chat-wrapper">
      <div class="popup-chat-container">
        <div class="popup-chat-header">
          <span>
            {{ conversation.user }}
          </span>
          <span class="close">
            <i class="pi pi-times" @click="$emit('close')"></i>
          </span>
        </div>
        <div class="popup-chat-body" v-chat-scroll>
          <ConversationChat :messages="conversation.messages" />
        </div>
        <div class="popup-chat-footer">
          <InputChat
            :wl="90"
            :wr="10"
            :hasIcon="false"
            :hasAttach="false"
            @send-message="actionSendMessage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputChat from "@/components/InputChat.vue";
import ConversationChat from "@/components/ConversationChat.vue";

export default {
  components: { InputChat, ConversationChat },

  props: {
    visible: { type: Boolean, default: false },
    conversation: { type: Object, default: null },
  },

  methods: {
    actionSendMessage(message) {
      console.log("actionSendMessage ~ message", message);
      this.$emit("send", {
        message,
        conversation: this.conversation,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/popup-chat";
</style>
