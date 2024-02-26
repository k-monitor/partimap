<template>
	<b-modal
		id="Rating-modal"
		ref="modal"
		:cancel-title="$t('modals.cancel')"
		ok-variant="success"
		:title="$t(`sheetEditor.interactions.Rating`)"
		@ok="handleOk"
		@show="reinit"
	>
		<h1>...</h1>
	</b-modal>
</template>

<script>
export default {
	props: {
		interactions: {
			type: Object,
			default: null,
		},
	},
	methods: {
		handleOk() {},
		reinit() {},
	},
};
</script>
