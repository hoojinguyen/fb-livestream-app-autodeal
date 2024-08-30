<template>
	<div class="exception-body access-body">
		<div class="exception-container">
			<img src="assets/layout/images/logo-dark.png" alt="apollo-layout"/>
			<h1>Denied</h1>
			<p>
				You do not have the necessary privileges.
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