export default {
	methods: {
		toast(message, variant) {
			this.$bvToast.toast(message, {
				autoHideDelay: 2500,
				noCloseButton: true,
				solid: true,
				toaster: 'b-toaster-bottom-center',
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
