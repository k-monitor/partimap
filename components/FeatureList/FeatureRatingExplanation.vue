<template>
	<div>{{ JSON.stringify(interactions) }}</div>
</template>

<script>
export default {
	inject: ['interactions'],
};
</script>
