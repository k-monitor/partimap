<template>
	<div
		class="d-flex flex-column pb-3"
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

		<div class="d-sm-none text-center">
			<button
				class="btn btn-primary"
				@click="$emit('jump')"
			>
				<i class="fas fa-map-marked-alt position-relative" />
				{{ $t('FeatureListElement.jumpToMap') }}
			</button>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		feature: {
			type: Object,
			required: true,
		},
	},
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
