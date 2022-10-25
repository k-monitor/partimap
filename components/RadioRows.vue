<template>
	<div>
		<b-form-group class="form-check form-check-inline">
			<b-form-radio-group
				horizontal
				v-model="pickedRow"
				:options="column"
			></b-form-radio-group>
		</b-form-group>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Array,
			default: () => [],
		},
		column: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			pickedRow: [],
		};
	},
};
</script>
