<template>
	<div
		v-if="sheet"
		class="flex-grow-1"
	>
		<!--<div class="sheet-sidebar">
			<b-sidebar
				id="sheet-sidebar"
				visible
				left
				no-header
				@change="showBottomNav = !showBottomNav"
			>
				<SheetEditor
					:sheet="sheet"
					:next-btn-shown="nextSheetExists()"
					:prev-btn-shown="prevSheetExists()"
					:visitor="visitor"
					:terms-and-use-accepted="termsAndUseAccepted"
					:submitted="submitted"
					@prevSheet="goToOtherSheet(-1)"
					@nextSheet="goToOtherSheet(1)"
					@toggleTermsAndUseAccepted="toggleTermsAndUseAccepted"
					@submit="submit"
				/>
			</b-sidebar>
		</div>-->
	</div>
</template>

<script>
export default {
	props: {
		sheetOrd: {
			type: String,
			required: true,
		},
		project: {
			type: Object,
			required: true,
		},
		visitor: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			termsAndUseAccepted: this.visitor ? 'not_accepted' : null,
		};
	},
	computed: {
		nextButtonDisabled() {
			if (this.visitor && this.firstSheet()) {
				return this.termsAndUseAccepted === 'not_accepted';
			} else {
				return false;
			}
		},
	},
	methods: {
		toggleTermsAndUseAccepted(val) {
			this.termsAndUseAccepted = val;
		},
	},
};
</script>

<style>
#sheet-sidebar {
	border-radius: 0.25rem;
	height: auto;
	top: 120px;
}
</style>
