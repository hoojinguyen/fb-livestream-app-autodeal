<template>
  <div ref="domNode" tabIndex="0" class="sc-emoji-picker" @blur="onBlur">
    <div class="sc-emoji-picker--content">
      <div
        v-for="category in emojiData"
        :key="category.name"
        class="sc-emoji-picker--category"
      >
        <div class="sc-emoji-picker--category-title">{{ category.name }}</div>
        <span
          v-for="emoji in category.emojis"
          :key="emoji"
          class="sc-emoji-picker--emoji"
          @click="emojiClicked(emoji)"
        >
          {{ emoji }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import EmojiConvertor from "emoji-js";
import emojiData from "@/constants/emoji";

export default {
  props: {
    onBlur: {
      type: Function,
    },
    onEmojiPicked: {
      type: Function,
    },
  },
  data() {
    return {
      emojiData,
      emojiConvertor: new EmojiConvertor(),
    };
  },

  mounted() {
    const elem = this.$refs.domNode;
    elem.style.opacity = 0;
    window.requestAnimationFrame(() => {
      elem.style.transition = "opacity 350ms";
      elem.style.opacity = 1;
    });
    this.$refs.domNode.focus();
    this.emojiConvertor.init_env();
  },

  methods: {
    emojiClicked(emoji) {
      this.onEmojiPicked(emoji);
      this.$refs.domNode.blur();
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/emoji-picker";
</style>
