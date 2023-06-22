<template>
	<b-modal
		:id="id"
		ref="modal"
	>
		{{ drawType }}
	</b-modal>
</template>

<script>
export default {
	props: {
		drawType: {
			type: String,
			default: null,
		},
		id: {
			type: String,
			default: null,
		},
		interactions: {
			type: Object,
			default: null,
		},
	},
	methods: {
		close() {
			this.$refs.modal.hide();
		},
	},
};
</script>
