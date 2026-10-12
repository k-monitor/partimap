<script setup lang="ts">
import type { Question } from '~/server/data/surveyAnswers';

const value = defineModel<string>({ default: '' });

const props = defineProps<{
	q: Question;
}>();

const shuffledOptions = computed(() => {
	const opts = props.q.options || [];
	return props.q.shuffleOptions ? shuffle(opts) : opts;
});

const options = computed(() =>
	shuffledOptions.value.map((o) => {
		const label = optionLabel(o);
		return {
			text: label,
			value: label,
			image: typeof o === 'object' && o.image ? o.image : undefined,
		};
	}),
);

const hasImages = computed(() => options.value.some((o) => o.image));
</script>

<template>
	<div
		v-if="hasImages"
		class="row"
	>
		<div
			v-for="o in options"
			:key="o.value"
			class="col-12 col-sm-6 mb-2"
		>
			<label
				class="w-100"
				style="cursor: pointer"
			>
				<div
					class="survey-image-box radio-image ratio ratio-4x3 mb-1 border rounded-1 shadow-sm"
					:class="{ 'border-primary': value === o.value }"
				>
					<img
						v-if="o.image"
						:src="o.image"
						:alt="o.text"
						class="img-fluid"
						style="object-fit: contain"
					/>
				</div>
				<b-form-radio
					v-model="value"
					:name="`q${q.id}`"
					:required="q.required"
					:value="o.value"
				>
					{{ o.text }}
				</b-form-radio>
			</label>
		</div>
	</div>
	<b-form-radio-group
		v-else
		v-model="value"
		:name="`q${q.id}`"
		:options="options"
		:required="q.required"
		stacked
	/>
</template>
