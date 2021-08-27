
<template>
	<div class="accordion" role="tablist">
		<b-card>
			<div class="map-title">
				<h4
					v-show="!titleEdit"
					@dblclick="titleEdit = true;
						$nextTick(() => $refs.titleEditor.focus())"
				>
					{{ mapTitle }}
				</h4>
				<input
					v-show="titleEdit"
					ref="titleEditor"
					v-model="changedTitle"
					autofocus
					class="w-100"
					@focusout="titleEdit=false; $emit('updateTitle',changedTitle)"
					@keyup.enter="titleEdit = false; $emit('updateTitle',changedTitle)"
				>
			</div>
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
	props: {
		mapTitle: {
			type: String,
			default: null // ezen még lehet gondolkozni
		}
	},
	data() {
		return {
			changedTitle: this.mapTitle,
			titleEdit: false
		};
	},
	computed: {
		...mapGetters({ getAllFeatures: 'features/getAllFeature' }),
		allFeatures() {
			return this.getAllFeatures;
		}
	},

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
