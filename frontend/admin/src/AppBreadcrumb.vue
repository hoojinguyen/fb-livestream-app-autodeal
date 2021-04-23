<template>
  <div class="layout-breadcrumb">
    <ul>
      <li>
        <button class="p-link" @click="home"><i class="pi pi-home"></i></button>
      </li>
      <li>{{ $route.path }}</li>
    </ul>

    <!-- <div class="layout-breadcrumb-options">
			<button class="p-link" title="Backup">
				<i class="pi pi-cloud-upload"></i>
			</button>
			<button class="p-link" title="Bookmark">
				<i class="pi pi-bookmark"></i>
			</button>
			<button class="p-link" title="Logout">
				<i class="pi pi-power-off"></i>
			</button>
		</div> -->
  </div>
</template>

<script>
export default {
  methods: {
    home() {
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style scoped></style>
