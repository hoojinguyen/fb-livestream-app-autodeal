<template>
	<div class="exception-body  error-body">
		<div class="exception-container">
			<img src="assets/layout/images/logo-dark.png" alt="apollo-layout" />
			<h1>Error</h1>
			<p>
				Please contact the system administrator.
			</p>

			<Button label="Go To Dashboard" icon="pi pi-arrow-left" @click="goDashboard" />
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			goDashboard(){
				this.$router.push({ path: '/' });
			}
		}
	}
</script>

<style scoped>

</style>