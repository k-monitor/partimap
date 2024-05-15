<script setup lang="ts">
definePageMeta({
	middleware: [
		function () {
			const localePath = useLocalePath();
			const route = useRoute();
			return navigateTo(localePath(`/p/${route.params.id}/0`));
		},
	],
});
</script>
