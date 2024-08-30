<template>
  <div class="conversation-chat-container">
    <ol class="conversation-chat" v-if="messages.length">
      <li
        v-for="(item, index) in messages"
        :key="index"
        :class="getClassName(item)"
      >
        <!-- :src="item.sender.id | getAvatarFbWithToken(item.accessToken)" -->
        <img
          :src="item.sender.avatar"
          alt="avatar"
          v-if="!item.isOwner"
          class="img-avatar"
        />
        <template v-if="item.sticker">
          <img :src="item.sticker" alt="img-sticker" class="img-sticker" />
        </template>
        <template v-else>
          <template v-if="item.attachments.length">
            <template v-if="item.attachments[0].image">
              <span>
                <img
                  :src="item.attachments[0].image"
                  alt="img-message"
                  class="img-message"
                />
              </span>
            </template>
            <template v-else-if="item.attachments[0].file">
              <a :href="item.attachments[0].file" class="file-url">{{
                item.attachments[0].name
              }}</a>
            </template>
          </template>
          <template v-else>
            <span>
              {{ item.message }}
            </span>
          </template>
        </template>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  props: {
    messages: { type: [Object, Array], default: () => [] },
  },

  methods: {
    getClassName(item) {
      if (item.isOwner) {
        if (
          item.sticker ||
          (item.attachments.length && item.attachments[0].image)
        ) {
          return "myself-image";
        } else {
          return "myself";
        }
      } else {
        return "you";
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/conversation-chat";
</style>
