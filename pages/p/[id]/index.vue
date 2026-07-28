<script setup lang="ts">
definePageMeta({
	middleware: [
		function () {
			const localePath = useLocalePath();
			const route = useRoute();
			return navigateTo(localePath({ path: `/p/${route.params.id}/0`, query: route.query }));
		},
	],
});
</script>
