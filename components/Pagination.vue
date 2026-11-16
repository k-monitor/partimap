<script setup lang="ts">
const props = defineProps<{
	pageCount: number;
}>();

const page = defineModel<number>({ required: true });

// first 3, current page with its neighbours, last 3, with gaps marked by null
const items = computed(() => {
	const n = props.pageCount;
	const p = page.value;
	const pages = [...new Set([1, 2, 3, p - 1, p, p + 1, n - 2, n - 1, n])]
		.filter(i => i >= 1 && i <= n)
		.sort((a, b) => a - b);

	const result: (number | null)[] = [];
	pages.forEach((i, idx) => {
		const prev = pages[idx - 1];
		if (prev !== undefined && i - prev === 2) result.push(i - 1); // a single page gap, show it instead of "..."
		else if (prev !== undefined && i - prev > 2) result.push(null);
		result.push(i);
	});
	return result;
});
</script>

<template>
	<nav
		v-if="pageCount > 1"
		class="mt-3"
	>
		<ul class="pagination flex-wrap justify-content-center row-gap-1">
			<li
				class="page-item"
				:class="{ disabled: page <= 1 }"
			>
				<button
					class="page-link"
					:disabled="page <= 1"
					@click="page--"
				>
					&laquo;
				</button>
			</li>
			<li
				v-for="(p, idx) in items"
				:key="p ?? `gap-${idx}`"
				class="page-item"
				:class="{ active: p === page, disabled: p === null }"
			>
				<span
					v-if="p === null"
					class="page-link"
				>
					&hellip;
				</span>
				<button
					v-else
					class="page-link"
					@click="page = p"
				>
					{{ p }}
				</button>
			</li>
			<li
				class="page-item"
				:class="{ disabled: page >= pageCount }"
			>
				<button
					class="page-link"
					:disabled="page >= pageCount"
					@click="page++"
				>
					&raquo;
				</button>
			</li>
		</ul>
	</nav>
</template>
