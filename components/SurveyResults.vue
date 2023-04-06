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
import { OTHER_ANSWER } from '../assets/constants';

export default {
	props: {
		data: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		chart(q) {
			let data = (q.options || [])
				.map(({ answer, count }) => ({
					name: answer,
					y: count,
				}))
				.map(a => {
					if (a.name === OTHER_ANSWER) {
						a.name = this.$t('SurveyResult.other');
					}
					return a;
				});
			if (
				'checkbox|dropdown|radiogroup'.includes(q.type) ||
				q.type.includes('Matrix')
			) {
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
			const avg = Math.round(q.average * 10) / 10;
			const avgText = 'number|range|rating'.includes(q.type)
				? ` | ${this.$t('SurveyResult.averageValue')}: ${avg}`
				: '';

			return {
				chart: {
					type: 'number|range'.includes(q.type) ? 'column' : 'bar',
				},
				credits: { enabled: false },
				legend: { enabled: false },
				series: [{ data }],
				subtitle: {
					text:
						this.$t('SurveyResult.numberOfSubmissions') +
						`: ${q.count}${avgText}`,
				},
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
