<template>
	<client-only>
		<b-overlay
			no-wrap
			opacity="0.5"
			:show="show"
		/>
		<template #placeholder>
			<b-overlay
				no-wrap
				opacity="0.5"
				show
			/>
		</template>
	</client-only>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
