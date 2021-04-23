<template>
  <div :class="containerClass" @click="onDocumentClick">
    <AppTopBar
      :topbarMenuActive="topbarMenuActive"
      :activeTopbarItem="activeTopbarItem"
      @menubutton-click="onMenuButtonClick"
      @topbar-menubutton-click="onTopbarMenuButtonClick"
      @topbar-item-click="onTopbarItemClick"
      @topbar-fan-page-click="onTopbarFanPageClick"
    ></AppTopBar>

    <transition name="layout-menu-container">
      <div
        class="layout-menu-container"
        @click="onMenuClick"
        v-show="isMenuVisible()"
      >
        <div class="layout-menu-content">
          <div class="layout-menu-title">MENU</div>
          <AppMenu
            :key="'appmsenu'"
            :model="menu"
            :layoutMode="layoutMode"
            :active="menuActive"
            @menuitem-click="onMenuItemClick"
            @root-menuitem-click="onRootMenuItemClick"
          ></AppMenu>
        </div>
      </div>
    </transition>

    <div class="layout-content">
      <AppBreadcrumb></AppBreadcrumb>

      <div class="layout-content-container">
        <router-view />
      </div>

      <div v-if="staticMenuMobileActive" class="layout-mask"></div>
    </div>
  </div>
</template>
<script>
import AppTopBar from "./AppTopbar.vue";
import AppMenu from "./AppMenu.vue";
import AppBreadcrumb from "./AppBreadcrumb.vue";

import EventBus from "./event-bus";
import { removeToken } from "@/utils/auth";

export default {
  data() {
    return {
      layoutMode: "static",
      staticMenuDesktopInactive: false,
      staticMenuMobileActive: false,
      overlayMenuActive: false,
      topbarMenuActive: false,
      activeTopbarItem: null,
      menuActive: false,
      menu: [
        { label: "Trang chủ", icon: "pi pi-fw pi-home", to: "/" },
        { label: "Báo cáo", icon: "pi pi-fw pi-chart-bar", to: "/report" },
      ],
    };
  },

  watch: {
    $route() {
      this.menuActive = false;
      this.$toast.removeAllGroups();
    },
  },

  methods: {
    onDocumentClick() {
      if (!this.topbarItemClick) {
        this.activeTopbarItem = null;
        this.topbarMenuActive = false;
      }

      if (!this.menuClick) {
        if (this.isHorizontal() || this.isSlim()) {
          this.menuActive = false;
        }

        EventBus.$emit("reset_active_index");
        this.hideOverlayMenu();
      }

      this.topbarItemClick = false;
      this.menuClick = false;
    },
    onMenuClick() {
      this.menuClick = true;
    },
    onMenuButtonClick(event) {
      this.menuClick = true;
      this.topbarMenuActive = false;

      if (this.layoutMode === "overlay" && !this.isMobile()) {
        this.overlayMenuActive = !this.overlayMenuActive;
      } else {
        if (this.isDesktop())
          this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        else this.staticMenuMobileActive = !this.staticMenuMobileActive;
      }

      event.preventDefault();
    },
    onTopbarMenuButtonClick(event) {
      this.topbarItemClick = true;
      this.topbarMenuActive = !this.topbarMenuActive;
      this.hideOverlayMenu();
      event.preventDefault();
    },

    async onTopbarItemClick(event) {
      // Logout Event
      if (event.item == "logout") {
        await removeToken();
        await location.reload();
      }

      if (this.activeTopbarItem === event.item) this.activeTopbarItem = null;
      else this.activeTopbarItem = event.item;

      event.originalEvent.preventDefault();

      this.topbarItemClick = false;
      // this.topbarItemClick = true;
    },
    onTopbarFanPageClick(page) {
      console.log("onTopbarFanPageClick -> page", page);
    },
    isDesktop() {
      return window.innerWidth > 1024;
    },
    isMobile() {
      return window.innerWidth <= 640;
    },
    isHorizontal() {
      return this.layoutMode === "horizontal";
    },
    isSlim() {
      return this.layoutMode === "slim";
    },
    hideOverlayMenu() {
      this.overlayMenuActive = false;
      this.staticMenuMobileActive = false;
    },
    onMenuItemClick(event) {
      if (!event.item.items) {
        EventBus.$emit("reset_active_index");
        this.hideOverlayMenu();
      }
      if (!event.item.items && (this.isHorizontal() || this.isSlim())) {
        this.menuActive = false;
      }
    },
    onRootMenuItemClick() {
      this.menuActive = !this.menuActive;
    },
    isMenuVisible() {
      if (this.isDesktop()) {
        if (this.layoutMode === "static")
          return !this.staticMenuDesktopInactive;
        else if (this.layoutMode === "overlay") return this.overlayMenuActive;
        else return true;
      } else {
        return true;
      }
    },
    toggleConfigurator() {
      this.configuratorActive = !this.configuratorActive;
    },
    hideConfigurator() {
      this.configuratorActive = false;
    },
    onLayoutChange(layoutMode) {
      this.layoutMode = layoutMode;
    },
  },
  computed: {
    containerClass() {
      return [
        "layout-wrapper",
        {
          "layout-horizontal": this.layoutMode === "horizontal",
          "layout-overlay": this.layoutMode === "overlay",
          "layout-static": this.layoutMode === "static",
          "layout-slim": this.layoutMode === "slim",
          "layout-static-inactive": this.staticMenuDesktopInactive,
          "layout-mobile-active": this.staticMenuMobileActive,
          "layout-overlay-active": this.overlayMenuActive,
          "p-input-filled": this.$appState.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.ripple === false,
        },
      ];
    },
  },
  components: {
    AppTopBar: AppTopBar,
    AppMenu: AppMenu,
    AppBreadcrumb: AppBreadcrumb,
  },
};
</script>

<style lang="scss">
@import "App.scss";
</style>
