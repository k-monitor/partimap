export default {
	methods: {
		toast(message, variant) {
			this.$bvToast.toast(message, {
				toaster: 'b-toaster-bottom-left',
				variant,
				solid: true,
				noCloseButton: true
			});
		},
		error(message) {
			this.toast(message, 'danger');
		},
		success(message) {
			this.toast(message, 'success');
		}
	}
};
