<script setup lang="ts">
// The old admin help page, replaced by the Súgó. Kept so that old links still work.
definePageMeta({
	middleware: [
		function () {
			const localePath = useLocalePath();
			return navigateTo(localePath({ name: 'sugo-keszites' }), { redirectCode: 301 });
		},
	],
});
</script>
