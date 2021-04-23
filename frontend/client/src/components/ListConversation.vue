<template>
  <div class="sale-message">
    <div class="sale-message__header">
      <!-- <div class="source-list">
        <div
          v-for="(src, index) in sourcesConversation"
          :key="index"
          class="source-list__item"
          :class="src.isActive ? 'is-active-source' : ''"
          @click="onChangeSource(src, index)"
        >
          <span class="sl-icon">
            <i :class="src.icon"></i>
          </span>
        </div>
      </div> -->

      <div class="filter-list">
        <div class="filter-list-item">
          <div class="filter-list-item__title">
            <!-- <p>{{ sourceConversationTitle }}</p> -->
            <p>Danh sách các đoạn hội thoại</p>
          </div>
          <div class="filter-list-item__action">
            <span
              v-for="(filter, i) in filterConversation"
              :key="i"
              @click="onFilterConversation(filter, i)"
              class="p-ml-2"
              :class="filter.isActive ? 'is-filter-active' : ''"
            >
              <i :class="filter.icon"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- Input search -->
      <div class="input-search p-col-12 p-pt-0">
        <span class="p-input-icon-left p-col-12">
          <i class="pi pi-search p-ml-2" />
          <InputText
            class="p-col-12"
            type="text"
            v-model="searchConversation"
            placeholder="Nhập theo tên, SĐT"
          />
        </span>
      </div>
      <!-- Input search -->
    </div>

    <div class="sale-message__body vld-parent" ref="messageList">
      <!-- List Message -->
      <template v-if="filterList.length">
        <div class="ml-chat-filter">
          <span v-for="(li, pos) in filterList" :key="pos" class="p-tag p-mr-2">
            {{ li }}
          </span>
        </div>
      </template>
      <div class="ml-chat-wrapper">
        <template v-if="conversations.length">
          <div
            class="ml-chat-card"
            v-for="(conv, ind) in conversations"
            :key="ind"
            :class="conv.id == idActive ? 'is-active-chat ' : ''"
            @click="onChoosseConversation(conv, ind)"
          >
            <div class="ml-chat-item">
              <!-- :src="conv.sender.id | getAvatarFbWithToken(conv.accessToken)" -->
              <img
                :src="conv.sender.avatar"
                alt="avatar"
                class="ml-chat-item__avatar"
              />
              <div class="ml-chat-item__info">
                <p class="info-name">
                  {{ conv.sender.name }}
                </p>
                <p class="info-comment">
                  {{ conv.message }}
                </p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="ml-chat-yet" v-if="!conversations.length">
            <div class="ml-chat-yet__center">
              <img
                width="156px"
                src="assets/layout/images/misa/ic_Khong_Tin_Nhan0.svg"
              />
              <p class="p-mt-2">KHÔNG CÓ KHÁCH HÀNG</p>
            </div>
          </div>
        </template>
      </div>
      <!-- List Message -->
    </div>
  </div>
</template>

<script>
import saleConstants from "@/constants/sale.js";

export default {
  props: {
    loading: { type: Boolean, default: false },
    conversations: { type: Array, default: () => [] },
  },

  data() {
    return {
      loader: null,
      idActive: "",
      searchConversation: "",
      idImg: "104048917872529",
      sourceConversationTitle: "Tất cả hội thoại",
      sourcesConversation: saleConstants.sourcesMessage,
      filterConversation: saleConstants.filtersMessage,
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
          container: this.$refs.messageList,
        });
      } else {
        this.loader.hide();
      }
    },
  },

  computed: {
    filterList() {
      return this.filterConversation
        .filter((el) => el.isActive)
        .map((el) => el.label);
    },
  },

  methods: {
    onChangeSource(source, position) {
      // const { action, isActive } = source;
      const { isActive } = source;
      if (isActive) return;

      const indexActived = this.sourcesConversation.findIndex(
        (el) => el.isActive
      );
      this.sourcesConversation[indexActived].isActive = false;
      this.sourcesConversation[position].isActive = true;
      this.sourceConversationTitle = this.sourcesConversation[position].label;

      // this.$store.dispatch("sale/getMessageBySource", { source: action });
    },

    onFilterConversation(filter, position) {
      const { isActive } = this.filterConversation[position];
      this.filterConversation[position].isActive = !isActive;
    },

    async onChoosseConversation(conv) {
      if (conv.id == this.idActive) return;
      this.idActive = conv.id;

      // Call Api get conversation and informationn customer
      await this.$emit("choosen", conv);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/components/message-list";
</style>
