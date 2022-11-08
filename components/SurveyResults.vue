<template>
	<div>
		<client-only>
			<highcharts
				v-for="q in data"
				:key="q.questionId"
				class="border mb-3 rounded shadow-sm"
				style="height: 300px"
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
			let data = (q.options || []).map(({ answer, count }) => ({
				name: answer,
				y: count,
			}));
			if ('checkbox|dropdown|radiogroup'.includes(q.type)) {
				data = data.sort((a, b) => b.y - a.y);
			} else if ('number|range'.includes(q.type)) {
				data = data.sort((a, b) => Number(a.name) - Number(b.name));
			}
			if (q.type === 'rating') {
				const nd = [];
				for (let i = 5; i >= 1; i--) {
					const y = data.filter(d => d.name === String(i))[0]?.y || 0;
					nd.push({ name: String(i), y });
				}
				data = nd;
			}
			const avgText = 'number|range|rating'.includes(q.type)
				? ` | Átlagos érték: ${Math.round(q.average * 10) / 10}`
				: '';

			return {
				chart: { type: 'number|range'.includes(q.type) ? 'column' : 'bar' },
				credits: { enabled: false },
				legend: { enabled: false },
				series: [{ data }],
				subtitle: { text: `Válaszadók száma: ${q.count}${avgText}` },
				title: { text: q.question },
				tooltip: {
					formatter() {
						return q.type === 'checkbox'
							? `${this.y}x ${this.x}`
							: `${this.y}x ${this.point.name}`;
					},
				},
				xAxis: {
					categories: data.map(o => o.name),
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
