<script setup lang="ts">
import type { Question } from '~/server/data/surveyAnswers';

const value = defineModel<Record<string, number | null>>({ default: {} });

const props = defineProps<{
	question: Question;
}>();

const max = computed(() => props.question.max || 100);

const inputValues = ref<Record<string, string | number | null>>({});
watchEffect(() => (inputValues.value = value.value));

const actualValues = computed(() => {
	const av: Record<string, number> = {};
	(props.question.options || []).forEach((o) => {
		av[o] = Math.max(0, parseInt(String(inputValues.value[o]).trim(), 10) || 0);
	});
	return av;
});

const sum = computed(() => Object.values(actualValues.value).reduce((a, b) => a + b, 0));
watch(sum, () => (value.value = actualValues.value));

function increase(o: string) {
	if (sum.value >= max.value) return;
	const v = Number(inputValues.value[o]) || 0;
	inputValues.value[o] = v + 1;
}

function decrease(o: string) {
	const v = Number(inputValues.value[o]) || 0;
	if (v > 0) inputValues.value[o] = v - 1;
}

function handleChange(o: string) {
	if (!String(inputValues.value[o]).match(/^\d+$/)) {
		inputValues.value[o] = null;
		return;
	}
	const v = Math.max(0, parseInt(String(inputValues.value[o]).trim(), 10) || 0);
	if (sum.value > max.value) {
		const excess = Math.max(sum.value - max.value, 0);
		inputValues.value[o] = Math.max(v - excess, 0);
	} else {
		inputValues.value[o] = Number(v);
	}
}
</script>

<template>
	<div class="d-flex flex-column">
		<div
			v-for="o in question.options"
			:key="o"
			class="border-bottom d-flex mb-1 pb-1"
		>
			<div class="d-flex flex-grow-1 align-items-center">{{ o }}</div>
			<div class="d-flex flex-shrink-0 align-items-center py-1">
				<b-button
					:disabled="actualValues[o] === 0"
					size="sm"
					variant="light"
					@click="decrease(o)"
				>
					<i class="fas fa-fw fa-minus text-primary" />
				</b-button>
				<input
					v-model="inputValues[o]"
					class="form-control form-control-sm mx-1 text-center"
					placeholder="0"
					style="width: 4rem"
					type="text"
					@input="handleChange(o)"
				/>
				<b-button
					:disabled="sum >= max"
					size="sm"
					variant="light"
					@click="increase(o)"
				>
					<i class="fas fa-fw fa-plus text-primary" />
				</b-button>
			</div>
		</div>
		<div class="d-flex justify-content-end">
			<input
				v-if="question.required || sum !== 0"
				required
				:max="max"
				:min="max"
				type="number"
				:value="sum"
				style="opacity: 0; pointer-events: none; width: 1px"
			/>
			<div
				class="flex-shrink-0 pr-2 pt-2 fw-bold"
				:class="{
					'text-muted': 0 === sum,
					'text-danger': sum !== max,
					'text-success': sum === max,
				}"
			>
				<span class="me-2">{{ max - sum }}</span>
				/ {{ max }}
			</div>
		</div>
	</div>
</template>
