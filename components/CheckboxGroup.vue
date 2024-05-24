<script setup lang="ts">
import type { Question } from '~/server/data/surveyAnswers';

const value = defineModel<string[]>({ default: [] });
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

const options = computed(() => {
	const opts = (props.q.options || []).map((o) => ({
		text: o,
		value: o,
		disabled: false,
	}));

	if (props.q.other) {
		opts.push({
			text: t('CheckboxGroup.other'),
			value: OTHER_PREFIX,
			disabled: false,
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
</script>

<template>
	<div>
		<div class="position-relative">
			<b-form-checkbox-group
				v-model="selected"
				:options="options"
				stacked
			/>
			<input
				v-if="q.required && (selected || []).length < 1"
				required
				type="checkbox"
				:oninvalid="`this.setCustomValidity('${$t('CheckboxGroup.required')}')`"
				style="bottom: 0; opacity: 0; position: absolute"
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
