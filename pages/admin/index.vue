<script setup lang="ts">
definePageMeta({
	middleware: [
		function () {
			const localePath = useLocalePath();
			return navigateTo(localePath('/admin/projects'));
		},
	],
});
</script>
