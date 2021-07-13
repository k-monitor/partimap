<template>
	<div class="flex-grow-1">
		<client-only placeholder="Loading...">
			<Map
				:initial-center="[2129152.791287463,6017729.508627875]"
				:initial-zoom="10"
				@change="log"
			/>
		</client-only>
	</div>
</template>

<script>
export default {
	methods: {
		log(payload) {
			console.log('map changed', JSON.stringify(payload));
		},
	},
};
</script>
