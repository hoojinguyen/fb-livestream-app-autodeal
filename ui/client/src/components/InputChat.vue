<template>
  <div class="input-chat-wrapper">
    <div class="input-chat">
      <div v-if="file" class="input-chat__file-attachment">
        <span class="input-chat__file-attachment__title">
          {{ file.name }}
        </span>
        <span class="input-chat__file-attachment__close" @click="_cancelFile">
          <img src="/assets/layout/images/icons/close.png" />
        </span>
      </div>
      <div class="input-chat__message">
        <div class="input-chat__message__type-box" :style="{ width: `${wl}%` }">
          <Textarea
            type="text"
            class="input-box-type"
            placeholder="Nhập tin nhắn ..."
            v-model="message"
            @keydown.enter.exact.prevent
            @keyup.enter.exact="_sendMessage"
          ></Textarea>
        </div>
        <div
          class="input-chat__message__action-box"
          :style="{ width: `${wr}%` }"
        >
          <!-- Emoji Picker -->
          <EmojiPicker
            v-if="isEmojiPicker"
            :on-emoji-picked="_pickedEmoji"
            :on-blur="_closeEmojiPicker"
          />
          <div
            class="button-box-action"
            @click.prevent="_openEmojiPicker"
            v-if="hasIcon"
            v-tooltip.top="'Chọn biểu tượng cảm xúc'"
          >
            <img src="/assets/layout/images/icons/emoji.png" />
          </div>
          <!-- Emoji Picker -->

          <!-- Attach files -->
          <div
            class="button-box-action"
            @click="_openAttachFile"
            v-if="hasAttach"
            v-tooltip.top="'Đính kèm ảnh'"
          >
            <input
              class="file-input-hidden"
              type="file"
              accept="video/mp4,image/x-png,image/gif,image/jpeg ,image/jpg"
              @change="_handleFile"
              ref="fileAttach"
            />
            <img src="/assets/layout/images/icons/attach.png" />
          </div>
          <!-- Attach files -->

          <!-- Send Messages -->
          <div
            class="button-box-action"
            @click="_sendMessage"
            v-tooltip.top="'Gửi tin nhắn'"
          >
            <img src="/assets/layout/images/icons/send.png" />
          </div>
          <!-- Send Messages -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmojiPicker from "@/components/EmojiPicker.vue";

export default {
  components: { EmojiPicker },

  props: {
    wl: { type: [Number, String], default: 80 },
    wr: { type: [Number, String], default: 20 },
    hasIcon: { type: Boolean, default: true },
    hasAttach: { type: Boolean, default: true },
  },

  data() {
    return {
      message: "",
      file: null,
      isEmojiPicker: false,
    };
  },

  methods: {
    _sendMessage() {
      const mess = {
        text: this.message,
        file: this.file,
      };
      this.message = "";
      this.file = null;
      this.$emit("send-message", mess);
    },

    _openAttachFile() {
      this.$refs.fileAttach.click();
    },

    _handleFile(e) {
      const value = e.target.files[0];
      this.file = value;
    },

    _cancelFile() {
      this.file = null;
    },

    _openEmojiPicker() {
      this.isEmojiPicker = !this.isEmojiPicker;
    },

    _closeEmojiPicker() {
      this.isEmojiPicker = false;
    },

    _pickedEmoji(emoji) {
      this.message += emoji;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/input-chat";
</style>
