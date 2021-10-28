export default {
	methods: {
		confirmDeletion(item) {
			return this.$bvModal.msgBoxConfirm(`Biztosan törlöd ezt: ${item}?`, {
				cancelTitle: 'Mégsem',
				cancelVariant: 'success',
				centered: true,
				footerClass: 'p-2',
				okTitle: 'Igen',
				okVariant: 'danger',
				title: 'Törlés',
			});
		},
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
