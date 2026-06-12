<script setup lang="ts">
const props = defineProps<{
	interactions: Interactions | null;
}>();

const drawingButtons = useDrawButtons(props.interactions);

const { featureCountByInteraction } = useVisitorData();
</script>

<template>
	<div class="my-4">
		<div
			v-for="b in drawingButtons"
			:key="b.drawingInteraction?.id || 'cancel'"
			class="d-flex mb-3"
		>
			<div class="d-flex flex-grow-1 position-relative">
				<span class="fw-bold my-auto">
					<span
						v-if="b.drawingInteraction?.required"
						class="text-danger"
					>
						*
					</span>
					{{ b.tooltip }}
				</span>

				<input
					v-if="
						b.drawingInteraction?.required &&
						(featureCountByInteraction[b.drawingInteraction.id] || 0) < 1
					"
					required
					type="checkbox"
					:oninvalid="`this.setCustomValidity('${$t('VisitorDrawButtonsInner.noFeatures', { di: b.drawingInteraction?.buttonLabel || $t(`sheetEditor.interactions.${b.drawingInteraction?.type}`) })}')`"
					style="
						bottom: 0;
						height: 1px;
						opacity: 0;
						pointer-events: none;
						position: absolute;
					"
					tabindex="-1"
				/>
			</div>
			<EdgeDrawingButton
				:options="b"
				side="right"
				visitor
			/>
		</div>
	</div>
</template>
