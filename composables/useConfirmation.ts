export default function useConfirmation() {
	const { t } = useI18n();
	const { confirm } = useModalController();

	function doConfirm(title: string, message: string) {
		return confirm?.({
			props: {
				cancelTitle: t('modals.cancel'),
				body: message,
				cancelVariant: 'success',
				centered: true,
				footerClass: 'p-2',
				okTitle: t('modals.yes'),
				okVariant: 'danger',
				title,
			},
		});
	}

	function confirmDeletion(item: string) {
		const msg = `${t('modals.confirmDeletion')}: ${item}`;
		return doConfirm(t('modals.delete'), msg);
	}

	function confirmDeleteFeatures(count: number) {
		const msg = t('modals.confirmDeleteFeatures', { count });
		return doConfirm(t('modals.delete'), msg);
	}

	function confirmFeatureClose() {
		return doConfirm(t('modals.unsaved'), t('modals.confirmFeatureClose'));
	}

	function confirmLeavingUnsaved() {
		return doConfirm(t('modals.unsaved'), t('modals.confirmUnsaved'));
	}

	function confirmNoFeatures() {
		return doConfirm(t('modals.unsaved'), t('modals.confirmNoFeatures'));
	}

	return {
		confirm: doConfirm,
		confirmDeletion,
		confirmDeleteFeatures,
		confirmFeatureClose,
		confirmLeavingUnsaved,
		confirmNoFeatures,
	};
}
