<template>
	<div class="d-sm-none text-center">
		<button
			class="btn btn-primary"
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
