<template>
	<AdminFrame>
		<template #header>
			Projektjeim
		</template>

		<ProjectList prefix="my" />
	</AdminFrame>
</template>

<script>
export default {
	middleware: ['auth', 'admin'],
	head: {
		title: 'Admin: Projektjeim',
	},
};
</script>
