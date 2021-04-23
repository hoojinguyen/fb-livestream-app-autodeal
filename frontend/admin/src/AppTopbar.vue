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
    <span style="margin-left:60px"> </span>

    <button class="p-link profile" @click="onTopbarMenuButtonClick">
      <span class="username p-mr-3">Admin</span>
      <template>
        <img :src="avatarDefault" alt="avatar" />
      </template>
      <i class="pi pi-angle-down"></i>
    </button>

    <ul :class="topbarItemsClass" role="menu">
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
import resources from "@/constants/resources";

export default {
  props: {
    topbarMenuActive: Boolean,
    activeTopbarItem: String,
  },

  data() {
    return {
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
  },

  computed: {
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
