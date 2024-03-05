<script setup lang="ts">
defineProps<{
	text: string;
}>();
</script>

<template>
	<div class="card-header p-0">
		<b-navbar>
			<b-navbar-nav>
				<b-nav-text>
					<h5 class="m-0">{{ text }}</h5>
				</b-nav-text>
			</b-navbar-nav>
			<b-navbar-nav class="ms-auto">
				<LangSwitcher />
			</b-navbar-nav>
		</b-navbar>
	</div>
</template>
