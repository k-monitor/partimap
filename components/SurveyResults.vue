<template>
	<div>
		<p>{{ data }}</p>
		<client-only>
			<highcharts
				v-for="q in data.filter(q => q.options)"
				:key="q.questionId"
				class="border mb-3 rounded shadow-sm"
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
			let data = [q.average];
			if (q.options) {
				data = q.options.map(({ answer, count }) => {
					if (q.type === 'checkbox') {
						return count;
					} else {
						return {
							name: answer,
							y: count,
						};
					}
				});
			}

			return {
				chart: { type: q.type === 'checkbox' ? 'bar' : 'pie' },
				credits: { enabled: false },
				legend: { enabled: false },
				series: [{ data }],
				subtitle: { text: `${q.count} beküldött válasz` },
				title: { text: q.question },
				tooltip: {
					formatter() {
						return q.type === 'checkbox'
							? `${this.y}x ${this.x}`
							: `${this.y}x ${this.point.name}`;
					},
				},
				xAxis: {
					categories:
						q.type === 'checkbox' ? q.options.map(o => o.answer) : null,
				},
				yAxis: {
					gridLineWidth: 0,
					labels: { enabled: false },
					title: { enabled: false },
				},
			};
		},
	},
};
</script>
