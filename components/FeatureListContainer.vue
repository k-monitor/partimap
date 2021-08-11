
<template>
	<b-row align-h="end">
		<b-col cols="4">
			<div>
				<b-card title="Card title" sub-title="Card subtitle">
					<b-card-text>
						<b-list-group>
							<FeatureListElement
								v-for="featureWrap in activeFeatures"
								:key="featureWrap.feature.ol_uid"
								:feature="featureWrap.feature"
							/>
						</b-list-group>
					</b-card-text>
				</b-card>
			</div>
		</b-col>
	</b-row>
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

<style>

</style>
