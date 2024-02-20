<template>
	<dl class="mb-0">
		<template v-if="answer">
			<dt>{{ feature.get('partimapFeatureQuestion') }}</dt>
			<dd class="mb-3">{{ answer.join(', ') }}</dd>
		</template>

		<template v-if="name">
			<dt>{{ $t('FeatureListElement.name') }}</dt>
			<dd class="mb-3">{{ name }}</dd>
		</template>

		<dt>{{ $t('FeatureListElement.description') }}</dt>
		<dd>{{ feature.get('description') }}</dd>
	</dl>
</template>

<script>
export default {
	inject: ['feature'],
	computed: {
		answer() {
			try {
				return JSON.parse(
					this.feature.get('partimapFeatureQuestion_ans')
				);
			} catch {
				return [];
			}
		},
		name() {
			return this.feature.get('name');
		},
	},
};
</script>
