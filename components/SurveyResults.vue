<template>
	<div>
		<p>{{ data }}</p>
		<client-only>
			<highcharts
				v-for="q in data"
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
			let type = 'pie';
			if (q.type === 'checkbox') {
				type = 'bar';
			} else if (!q.options) {
				type = 'solidgauge';
			}

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
				chart: { type },
				credits: { enabled: false },
				legend: { enabled: false },
				pane: {
					center: ['50%', '85%'],
					size: '140%',
					startAngle: -90,
					endAngle: 90,
					background: {
						innerRadius: '60%',
						outerRadius: '100%',
						shape: 'arc',
					},
				},
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
					max: Number(q.max),
					min: Number(q.min),
					labels: { enabled: !q.options },
					title: { enabled: false },
				},
			};
		},
	},
};
</script>
