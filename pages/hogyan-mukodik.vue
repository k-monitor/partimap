<script setup lang="ts">
// The old help page, replaced by the Súgó. Kept so that old links still work.
defineI18nRoute({
	paths: {
		en: '/how-it-works',
		es: '/guia-del-usuario',
		lt: '/naudojimosi-instrukcija',
	},
});

definePageMeta({
	middleware: [
		function (to) {
			const localePath = useLocalePath();
			// `?visitor` showed only the part of the old page meant for respondents
			const name = 'visitor' in to.query ? 'sugo-kitoltoknek' : 'sugo';
			return navigateTo(localePath({ name }), { redirectCode: 301 });
		},
	],
});
</script>
