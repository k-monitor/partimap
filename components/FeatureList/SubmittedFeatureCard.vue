<template>
	<div
		class="d-flex flex-column"
		style="gap: 1rem"
	>
		<dl class="mb-0">
			<template v-if="answer">
				<dt>{{ feature.get('partimapFeatureQuestion') }}</dt>
				<dd>
					<p>{{ answer.join(', ') }}</p>
				</dd>
			</template>

			<template v-if="name">
				<dt>{{ $t('FeatureListElement.name') }}</dt>
				<dd>
					<p>{{ name }}</p>
				</dd>
			</template>

			<dt>{{ $t('FeatureListElement.description') }}</dt>
			<dd>
				<p>{{ feature.get('description') }}</p>
			</dd>
		</dl>

		<div>
			<span
				class="text-danger"
				role="button"
				@click="$emit('delete')"
			>
				<i class="fas fa-fw fa-trash mr-1" />
				{{ $t('FeatureListElement.deleteFeature') }}
			</span>
		</div>
	</div>
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
