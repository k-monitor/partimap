export default {
	methods: {
		confirmDeletion(item) {
			const msg = `${this.$t('modals.confirmDeletion')}: ${item}`;
			return this.$bvModal.msgBoxConfirm(msg, {
				cancelTitle: this.$t('modals.cancel'),
				cancelVariant: 'success',
				centered: true,
				footerClass: 'p-2',
				okTitle: this.$t('modals.yes'),
				okVariant: 'danger',
				title: this.$t('modals.delete'),
			});
		},
		confirmLeavingUnsaved() {
			return this.$bvModal.msgBoxConfirm(
				this.$t('modals.confirmUnsaved'),
				{
					cancelTitle: this.$t('modals.cancel'),
					cancelVariant: 'success',
					centered: true,
					footerClass: 'p-2',
					okTitle: this.$t('modals.yes'),
					okVariant: 'danger',
					title: this.$t('modals.unsaved'),
				}
			);
		},
	},
};
