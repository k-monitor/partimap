export default function useToasts() {
	const { create } = useToastController();

	function toast(message: string, variant: string) {
		const colorClasses =
			variant === 'danger'
				? 'bg-danger border-danger text-white'
				: 'bg-dark border-secondary text-white';

		const toast = create({
			noCloseButton: true,
			noProgress: true,
			position: 'bottom-center',
			solid: true,
			title: message,
			toastClass: `${colorClasses} border mb-5 rounded shadow-sm text-center`,
		});
		window.setTimeout(() => toast?.destroy(), 2500);
	}

	function errorToast(message: string) {
		toast(message, 'danger');
	}

	function successToast(message: string) {
		toast(message, 'success');
	}

	return {
		errorToast,
		successToast,
	};
}
