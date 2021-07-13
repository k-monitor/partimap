<template>
	<div class="flex-grow-1">
		<client-only placeholder="Loading...">
			<Map
				initial-zoom="3"
				@change="log"
			/>
		</client-only>
	</div>
</template>

<script>
export default {
	methods: {
		log(payload) {
			console.log('map changed', payload);
		},
	},
};
</script>
