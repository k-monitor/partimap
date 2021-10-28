export default {
	methods: {
		confirmLeavingUnsaved() {
			return this.$bvModal.msgBoxConfirm('Még nem mentetted el a módosításokat. Biztosan kilépsz?', {
				cancelTitle: 'Mégsem',
				cancelVariant: 'success',
				centered: true,
				footerClass: 'p-2',
				okTitle: 'Igen',
				okVariant: 'danger',
				title: 'Nem mentett módosítások',
			});
		},
	}
};
