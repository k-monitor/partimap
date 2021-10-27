export default {
	methods: {
		toast(message, variant) {
			this.$bvToast.toast(message, {
				autoHideDelay: 1000,
				noCloseButton: true,
				solid: true,
				toaster: 'b-toaster-bottom-left',
				variant,
			});
		},
		errorToast(message) {
			this.toast(message, 'danger');
		},
		success(message) {
			this.toast(message, 'success');
		}
	}
};
