<script setup lang="ts">
import type { Options, PointOptionsObject } from 'highcharts/highcharts';
import type { AggregatedAnswers } from '~/server/data/surveyAnswers';

const props = defineProps<{
	brandColor?: string | null;
	data: AggregatedAnswers[];
}>();

const { t } = useI18n();

function chart(q: AggregatedAnswers) {
	let data: PointOptionsObject[] = (q.options || [])
		.map(({ answer, count, average }) => ({
			name: answer,
			y: count || average || 0,
		}))
		.map((a) => {
			if (a.name === OTHER_ANSWER) {
				a.name = t('SurveyResult.other');
			}
			return a;
		});

	if (
		'checkbox|distributeUnits|dropdown|radiogroup'.includes(q.type) ||
		q.type.includes('Matrix')
	) {
		data = data.sort((a, b) => b.y! - a.y!);
	} else if ('number|range'.includes(q.type)) {
		data = data.sort((a, b) => Number(a.name) - Number(b.name));
	}

	if (q.type === 'rating') {
		const nd = [];
		for (let i = 5; i >= 1; i--) {
			const y = data.filter((d) => d.name === String(i))[0]?.y || 0;
			nd.push({ name: String(i), y });
		}
		data = nd;
	}

	const avg = q.average ? Math.round(q.average * 10) / 10 : 0;
	const avgText =
		'number|range|rating'.includes(q.type) && avg
			? ` | ${t('SurveyResult.averageValue')}: ${avg}`
			: '';

	const options: Options = {
		accessibility: { enabled: false }, // as it does not recognize included accessibility.js
		colors: [props.brandColor || PARTIMAP_BLUE],
		credits: { enabled: false },
		legend: { enabled: false },
		series: [
			{
				type: 'number|range'.includes(q.type) ? 'column' : 'bar',
				data,
			},
		],
		subtitle: {
			text: t('SurveyResult.numberOfSubmissions') + `: ${q.count}${avgText}`,
		},
		title: { text: q.question },
		tooltip: {
			formatter() {
				if (q.type === 'checkbox') return `${this.y}x ${this.x}`;
				if (q.type === 'distributeUnits') return `${this.y} ${this.x}`;
				const pct = Math.round((100 * (this.y || 0)) / q.count);
				return `${this.y}x (${pct}%) ${this.point.name}`;
			},
		},
		xAxis: {
			categories: data.map((o) => o.name || ''),
		},
		yAxis: {
			gridLineWidth: 0,
			labels: { enabled: false },
			title: { text: null },
		},
	};
	return options;
}
</script>

<template>
	<div>
		<client-only>
			<highchart
				v-for="q in data"
				:key="q.questionId"
				class="border mb-3 rounded shadow-sm"
				style="height: 300px"
				:options="chart(q)"
			/>
		</client-only>
	</div>
</template>
