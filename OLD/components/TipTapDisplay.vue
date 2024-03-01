<template>
	<div
		ref="html"
		class="rich"
		v-html="html"
	/>
</template>

<script>
import * as basicLightbox from 'basiclightbox';

export default {
	props: {
		html: {
			type: String,
			default: '',
		},
	},
	mounted() {
		Array.from(this.$refs.html.querySelectorAll('img')).forEach(img => {
			img.style.cursor = 'pointer';
			img.addEventListener('click', () => {
				const blb = basicLightbox.create(`<img src="${img.src}">`);
				blb.show();

				function closeOnEsc(e) {
					if (e.key === 'Escape') {
						blb.close();
						window.removeEventListener('keydown', closeOnEsc);
					}
				}
				window.addEventListener('keydown', closeOnEsc);
			});
		});
	},
};
</script>
