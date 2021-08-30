
<template>
	<div class="accordion" role="tablist">
		<b-card>
			<div class="overflow-auto">
				<b-card-text>
					<b-list-group>
						<FeatureListElement
							v-for="feature in allFeatures"
							:key="feature.getId()"
							:feature="feature"
						/>
					</b-list-group>
				</b-card-text>
			</div>
		</b-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	computed: {
		...mapGetters({ getAllFeatures: 'features/getAllFeature' }),
		allFeatures() {
			return this.getAllFeatures;
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
