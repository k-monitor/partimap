<script setup lang="ts">
import * as basicLightbox from 'basiclightbox';

const props = defineProps<{
	html: string | null;
}>();

const htmlRef = ref<HTMLDivElement>();

onMounted(() => {
	if (!htmlRef.value) return;
	Array.from(htmlRef.value.querySelectorAll('img')).forEach((img) => {
		img.style.cursor = 'pointer';
		img.addEventListener('click', () => {
			const blb = basicLightbox.create(`<img src="${img.src}">`);
			blb.show();

			function closeOnEsc(e: KeyboardEvent) {
				if (e.key === 'Escape') {
					blb.close();
					window.removeEventListener('keydown', closeOnEsc);
				}
			}
			window.addEventListener('keydown', closeOnEsc);
		});
	});
});
</script>

<template>
	<div
		ref="htmlRef"
		class="rich"
		v-html="html"
	/>
</template>
