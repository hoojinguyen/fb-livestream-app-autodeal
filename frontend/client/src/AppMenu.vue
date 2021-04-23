<template>
  <AppSubmenu
    class="layout-menu layout-main-menu clearfix"
    :items="model"
    :layoutMode="layoutMode"
    :menuActive="active"
    :root="true"
    :parentMenuItemActive="true"
    @menuitem-click="onMenuItemClick"
    @root-menuitem-click="onRootMenuItemClick"
  />
</template>

<script>
import AppSubmenu from "./AppSubmenu";

export default {
  props: {
    model: Array,
    layoutMode: String,
    active: Boolean,
  },
  methods: {
    onMenuItemClick(event) {
      this.$emit("menuitem-click", event);
    },
    onRootMenuItemClick(event) {
      this.$emit("root-menuitem-click", event);
    },
  },
  components: {
    AppSubmenu: AppSubmenu,
  },
};
</script>

<style scoped></style>
