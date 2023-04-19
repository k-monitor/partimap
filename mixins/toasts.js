export default {
	methods: {
		toast(message, variant) {
			const colorClasses =
				variant === 'danger'
					? 'bg-danger border-danger text-white'
					: 'bg-dark border-secondary text-white';

			this.$bvToast.toast(message, {
				autoHideDelay: 2500,
				bodyClass: `${colorClasses} border font-weight-bold rounded shadow-sm text-center`,
				noCloseButton: true,
				solid: true,
				toaster: 'b-toaster-bottom-center',
			});
		},
		errorToast(message) {
			this.toast(message, 'danger');
		},
		success(message) {
			this.toast(message, 'success');
		},
	},
};
