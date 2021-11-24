<template>
	<div>
		<p>{{ data }}</p>
		<client-only>
			<highcharts
				v-for="q in data.filter(q => q.options)"
				:key="q.questionId"
				:options="chart(q)"
			/>
		</client-only>
	</div>
</template>

<script>
export default {
	props: {
		data: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		chart(q) {
			return {
				chart: {
					type: 'pie',
				},
				series: [
					{
						data: q.options.map(({ answer, count }) => ({
							name: answer,
							y: count,
						})),
					},
				],
				title: {
					text: q.questionId, // TODO question label
				},
				tooltip: {
					formatter() {
						return `${this.point.name}: ${this.y}x (${this.percentage}%)`;
					},
				},
			};
		},
	},
};
</script>
