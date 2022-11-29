<template>
	<div>
		<div class="container">
			<table class="table">
				<tr>
					<div style="">
						<td style="min-width:100px;"></td>
						<td v-for="column in question.column" :key="column">
							{{ column }}
						</td>
					</div>
				</tr>
				<tr class="hover-row" v-for="row in question.row" :key="row">
					<RadioRows
						v-model="selected[row]"
						:question="question"
						:row="row"
					/>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Array,
			default: () => [],
		},
		question: {
			type: Object,
			default: () => {},
		},
		answers: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			a: this.answers,
			selected: this.value,
			picked: [],
			obj: {},
		};
	},
	watch: {
		selected: {
			handler(a) {
				this.picked = [];
				for (let i = 0; i < Object.keys(a).length; i++) {
					this.picked.splice(i, 1, { [Object.keys(a)[i]]: Object.values(a)[i] });
				}
				this.$emit('input', this.picked);
			},
			deep: true,
		},
	},
};
</script>

<style scoped>
.container{
	overflow-x: auto;
}
.header{
	min-width:90px;
	max-width:90px;
	word-wrap: break-word;
}
td.header:first-child {
}
.hover-row:hover {background-color: rgb(227, 227, 227);}
</style>
