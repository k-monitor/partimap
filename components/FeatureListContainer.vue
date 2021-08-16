
<template>
	<div class="accordion" role="tablist">
		<b-card title="Card title">
			<div class="overflow-auto">
				<b-card-text>
					<b-list-group>
						<FeatureListElement
							v-for="feature in allFeatures"
							:key="feature.ol_uid"
							:feature="feature"
						/>
					</b-list-group>
				</b-card-text>
			</div>
			<template #footer>
				<b-button
					variant="danger"
					class="float-right"
					@click="$nuxt.$emit('clearFeatures')"
				>
					Törlés
				</b-button>
			</template>
		</b-card>
	</div>
</template>

<script>
export default {
	props: {
		allFeatures: {
			type: Array,
			default: () => [],
		}
	}
};

</script>

<style scoped>
.card-body {
    overflow: auto;
}

.card {
    overflow: hidden;
    position: relative;
    max-height: 80vh;
}
</style>
