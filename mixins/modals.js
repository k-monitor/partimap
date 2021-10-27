export default {
	methods: {
		askSaveModifications() {
			return this.$bvModal.msgBoxConfirm('El akarod menteni a módosításokat?', {
				cancelTitle: 'Nem',
				cancelVariant: 'danger',
				centered: true,
				footerClass: 'p-2',
				hideHeaderClose: false,
				okTitle: 'Igen',
				okVariant: 'success',
				title: 'Visszalépés',
			});
		},
	}
};
