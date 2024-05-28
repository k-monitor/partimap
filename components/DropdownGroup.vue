<script setup lang="ts">
import type { Question } from '~/server/data/surveyAnswers';

const value = defineModel<string>({ default: '' });

const props = defineProps<{
	q: Question;
}>();

const selected = ref<string>('');
const otherValue = ref('');

function parseAnswer() {
	selected.value = value.value.startsWith(OTHER_PREFIX) ? OTHER_PREFIX : value.value;
	otherValue.value = value.value.startsWith(OTHER_PREFIX)
		? value.value.slice(OTHER_PREFIX.length)
		: '';
}
watchEffect(() => parseAnswer());

watch([selected, otherValue], () => {
	value.value =
		selected.value === OTHER_PREFIX ? OTHER_PREFIX + otherValue.value : selected.value;
});

const { t } = useI18n();

const options = computed(() => {
	const opts = [
		{
			text: '',
			value: '',
		},
	];

	(props.q.options || []).forEach((o) =>
		opts.push({
			text: o,
			value: o,
		}),
	);

	if (props.q.other) {
		opts.push({
			text: t('DropdownGroup.other'),
			value: OTHER_PREFIX,
		});
	}

	return opts;
});

const otherInput = ref<HTMLInputElement | null>();

const otherSelected = computed(() => selected.value.startsWith(OTHER_PREFIX));

watch(otherSelected, async (s) => {
	if (s) {
		await nextTick();
		otherInput.value?.focus();
	}
});
</script>

<template>
	<div>
		<select
			v-model="selected"
			class="form-select"
			:required="q.required"
		>
			<option
				v-for="o in options"
				:key="o.value"
				:value="o.value"
			>
				{{ o.text }}
			</option>
		</select>
		<div
			v-if="selected == OTHER_PREFIX"
			class="mt-2"
		>
			<div class="d-flex">
				<div class="d-flex flex-column mx-3">
					<i class="fa fa-level-up-alt fa-rotate-90 m-auto" />
				</div>
				<b-form-input
					ref="otherInput"
					v-model="otherValue"
					:required="q.required"
				/>
			</div>
		</div>
	</div>
</template>
