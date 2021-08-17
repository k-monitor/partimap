
<template>
	<div class="accordion" role="tablist">
		<b-card title="Card title">
			<div class="overflow-auto">
				<b-card-text>
					<b-list-group>
						<FeatureListElement
							v-for="feature in allFeatures"
							:key="feature.ol_uid"
							:selected="feature.get('selected')"
							:feature="feature"
						/>
					</b-list-group>
				</b-card-text>
			</div>
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
