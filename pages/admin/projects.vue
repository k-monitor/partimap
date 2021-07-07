<template>
	<AdminFrame>
		<template #header>
			Projektek
		</template>

		<ProjectList prefix="admin" />
	</AdminFrame>
</template>

<script>
export default {
	middleware: ['auth', 'admin'],
	head: {
		title: 'Admin: Projektek',
	},
};
</script>
