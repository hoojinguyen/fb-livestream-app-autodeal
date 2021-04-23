<template>
  <div class="topbar clearfix">
    <button class="p-link menu-button" @click="onMenuButtonClick">
      <i class="pi pi-bars"></i>
    </button>

    <router-link to="/" class="logo-link">
      <img
        class="logo"
        alt="apollo-layout"
        src="/assets/layout/images/flad_logo.png"
      />
    </router-link>
    <span style="margin-left:60px">
      <button
        class="p-link menu-button p-ml-0 p-pl-0 p-mr-0 p-pr-0 button-fanpage"
        v-for="(page, index) in pages"
        :key="index"
        @click="onClickPage(page)"
      >
        <img
          class="img-fanpage"
          :class="page.id == pageCurrent.id ? 'img-fanpage-active' : ''"
          :src="page.id | getAvatarFB()"
          :alt="page.name"
        />
      </button>
    </span>

    <button class="p-link profile" @click="onTopbarMenuButtonClick">
      <span class="username p-mr-3">{{ user.name }}</span>
      <template v-if="user.avatar">
        <img :src="user.avatar" :alt="user.avatar" />
      </template>
      <template v-else>
        <img :src="avatarDefault" alt="avatar" />
      </template>
      <i class="pi pi-angle-down"></i>
    </button>

    <ul :class="topbarItemsClass" role="menu">
      <!-- <li
        :class="[{ 'menuitem-active': activeTopbarItem === 'profile' }]"
        @click="
          $emit('topbar-item-click', { originalEvent: $event, item: 'profile' })
        "
        role="none"
      >
        <button class="p-link">
          <i class="topbar-icon pi pi-fw pi-user"></i>
          <span class="topbar-item-name">Hồ sơ</span>
        </button>
      </li> -->

      <li
        :class="[{ 'menuitem-active': activeTopbarItem === 'setting' }]"
        @click="
          $emit('topbar-item-click', { originalEvent: $event, item: 'setting' })
        "
        role="none"
      >
        <button class="p-link">
          <i class="topbar-icon pi pi-fw pi-cog"></i>
          <span class="topbar-item-name">Cài đặt </span>
        </button>
      </li>

      <!-- <li
        :class="[{ 'menuitem-active': activeTopbarItem === 'resync' }]"
        @click="
          $emit('topbar-item-click', { originalEvent: $event, item: 'resync' })
        "
        role="none"
      >
        <button class="p-link">
          <i class="topbar-icon pi pi-fw pi-undo"></i>
          <span class="topbar-item-name">Đồng bộ dữ liệu </span>
        </button>
      </li> -->

      <li
        :class="[{ 'menuitem-active': activeTopbarItem === 'logout' }]"
        @click="
          $emit('topbar-item-click', { originalEvent: $event, item: 'logout' })
        "
        role="none"
      >
        <button class="p-link">
          <i class="topbar-icon pi pi-fw pi-power-off"></i>
          <span class="topbar-item-name">Đăng xuất</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { getJSONStorageReader } from "@/helpers/local-storage.js";
import resources from "@/constants/resources";
const pageConnectedLocal = getJSONStorageReader("pageConnected");
const pageCurrentLocal = getJSONStorageReader("pageCurrent");

export default {
  props: {
    topbarMenuActive: Boolean,
    activeTopbarItem: String,
  },

  data() {
    return {
      pageCurrent: pageCurrentLocal.get(),
      avatarDefault: resources.avatarDefault,
    };
  },

  methods: {
    onMenuButtonClick(event) {
      this.$emit("menubutton-click", event);
    },

    onTopbarMenuButtonClick(event) {
      this.$emit("topbar-menubutton-click", event);
    },

    onClickPage(page) {
      pageCurrentLocal.set(page);
      location.reload();
      // this.$emit("topbar-fan-page-click", page);
    },
  },

  computed: {
    user() {
      return this.$store.state.user.user;
    },

    pages() {
      return pageConnectedLocal.get();
    },

    topbarItemsClass() {
      return [
        "topbar-menu fadeInDown",
        {
          "topbar-menu-visible": this.topbarMenuActive,
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.button-fanpage {
  &:focus {
    box-shadow: none !important;
  }

  .img-fanpage {
    vertical-align: middle;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .img-fanpage-active {
    border: 2px solid #f6f6f6;
  }
}
</style>
