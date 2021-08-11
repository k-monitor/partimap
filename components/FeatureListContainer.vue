
<template>
	<div>
		<div>
			<b-row align-h="end">
				<b-col cols="4">
					<b-card title="Card title" sub-title="Card subtitle">
						<div class="overflow-auto">
							<b-card-text>
								<b-list-group>
									<FeatureListElement
										v-for="featureWrap in activeFeatures"
										:key="featureWrap.feature.ol_uid"
										:feature="featureWrap.feature"
									/>
								</b-list-group>
							</b-card-text>
						</div>
						<template #footer>
							<em>Footer Slot</em>
						</template>
					</b-card>
				</b-col>
			</b-row>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		activeFeatures: {
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
    max-height: 60vh;
}
</style>
