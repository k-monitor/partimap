<template>
	<div>
		<tr>
			<td class="table-row">{{row}}</td>
			<td class="table-row" v-for="column in question.column" :key="column">
				<div>
					<b-form-radio
						v-model="selected"
						:value="column"
					></b-form-radio>
				</div>
			</td>
		</tr>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: () => '',
		},
		column: {
			type: Array,
			default: () => [],
		},
		row: {
			type: String,
			default: () => '',
		},
		question: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			selected: this.value,
			picked: [],
		};
	},
	watch: {
		selected(a) {
			console.log('radioRow: ' + JSON.stringify(a));
			// console.log('picked: ' + JSON.stringify(this.picked));
			this.$emit('input', this.selected);
		},
	},
	mounted() {
		// console.log('mounted: ' + JSON.stringify(this.selected));
	}
};
</script>
<style scoped>
.table-row{
	min-width:90px;
	max-width:90px;
	word-wrap: break-word;
	text-align: center;
	vertical-align: middle!important;
}
</style>
