<template>
	<div>
		<div class="container">
			<table class="table">
				<tr>
					<div>
						<td class="header"/>
						<td v-for="column in question.column" :key="column" class="header">
							{{ column }}
						</td>
					</div>
				</tr>
				<tr v-for="row in question.row" :key="row" class="hover-row" >
					<MatrixRows
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
			type: Object,
			default: () => {},
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
			selected: this.value || {},
			picked: [],
		};
	},
	watch: {
		selected: {
			handler(a) {
				this.$emit('input', a);
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
.hover-row:hover {background-color: rgb(227, 227, 227);}
</style>
