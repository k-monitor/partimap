<script setup lang="ts">
import type { Question } from '~/server/data/surveyAnswers';

const value = defineModel<string[]>({ default: () => [] });
/*
   ['Option X', 'Option Y', 'Option Z','OTHER_PREFIX user input']
*/

const props = defineProps<{
	q: Question;
}>();

const selected = ref<string[]>([]);
const otherValue = ref('');

function parseAnswers() {
	selected.value = value.value.map((o) => {
		if (o.startsWith(OTHER_PREFIX)) {
			otherValue.value = o.slice(OTHER_PREFIX.length);
			return OTHER_PREFIX;
		}
		return o;
	});
}
onMounted(() => parseAnswers());

watch([selected, otherValue], () => {
	value.value = selected.value.map((o) =>
		o === OTHER_PREFIX ? OTHER_PREFIX + otherValue.value : o,
	);
});

const { t } = useI18n();

const shuffledOptions = computed(() => {
	const opts = props.q.options || [];
	return props.q.shuffleOptions ? shuffle(opts) : opts;
});

const options = computed(() => {
	const opts = shuffledOptions.value.map((o) => {
		const label = optionLabel(o);
		return {
			text: label,
			value: label,
			disabled: false,
			image: typeof o === 'object' && o.image ? o.image : undefined,
			other: false,
		};
	});

	if (props.q.other) {
		opts.push({
			text: t('CheckboxGroup.other'),
			value: OTHER_PREFIX,
			disabled: false,
			image: undefined,
			other: true,
		});
	}

	const max = props.q.max || opts.length;
	if (selected.value.length >= max) {
		opts.forEach((o) => {
			if (!selected.value.includes(o.value)) {
				o.disabled = true;
			}
		});
	}
	return opts;
});

const otherInput = ref<HTMLInputElement | null>();

const otherSelected = computed(
	() => selected.value.filter((o) => o.startsWith(OTHER_PREFIX)).length,
);

watch(otherSelected, async (s) => {
	if (s) {
		await nextTick();
		otherInput.value?.focus();
	}
});

const hasImages = computed(() => options.value.some((o) => o.image));
</script>

<template>
	<div>
		<div class="position-relative">
			<div
				v-if="hasImages"
				class="row"
			>
				<div
					v-for="o in options"
					:key="o.value"
					class="mb-2"
					:class="[o.other ? 'col-12' : 'col-12 col-sm-6']"
				>
					<label
						class="w-100"
						style="cursor: pointer"
					>
						<div
							v-if="!o.other"
							class="survey-image-box ratio ratio-4x3 mb-1 border rounded-1 shadow-sm"
							:class="{ 'border-primary': selected.includes(o.value) }"
							:style="{ opacity: o.disabled ? 0.5 : 1 }"
						>
							<img
								v-if="o.image"
								:src="o.image"
								:alt="o.text"
								class="img-fluid"
								style="object-fit: contain"
							/>
						</div>
						<b-form-checkbox
							v-model="selected"
							:disabled="o.disabled"
							:value="o.value"
						>
							{{ o.text }}
						</b-form-checkbox>
					</label>
				</div>
			</div>
			<b-form-checkbox-group
				v-else
				v-model="selected"
				:options="options"
				stacked
			/>
			<input
				v-if="q.required && (selected || []).length < 1"
				required
				tabindex="-1"
				type="checkbox"
				:oninvalid="`this.setCustomValidity('${t('CheckboxGroup.required')}')`"
				style="bottom: 0; height: 1px; opacity: 0; pointer-events: none; position: absolute"
			/>
		</div>
		<div
			v-if="otherSelected"
			class="mt-2"
		>
			<div class="d-flex pl-3">
				<div class="d-flex flex-column mx-3">
					<i class="fa fa-level-up-alt fa-rotate-90 m-auto" />
				</div>
				<input
					ref="otherInput"
					v-model="otherValue"
					class="form-control"
					:required="q.required"
				/>
			</div>
		</div>
	</div>
</template>
