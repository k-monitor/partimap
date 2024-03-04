<script setup lang="ts">
useHead({
	title: 'Test',
});
</script>

<template>
	<div class="container bg-white rounded">
		<h1>{{ $t('meta.description') }}</h1>
		<h1><i class="fa-lg fas fa-globe"></i></h1>
	</div>
</template>
