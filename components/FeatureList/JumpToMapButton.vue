<template>
	<div class="d-sm-none">
		<button
			class="btn btn-outline-primary"
			@click="setSidebarVisible(false)"
		>
			<i class="fas fa-map-marked-alt position-relative" />
			{{ $t('FeatureListElement.jumpToMap') }}
		</button>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	methods: {
		...mapMutations(['setSidebarVisible']),
	},
};
</script>
