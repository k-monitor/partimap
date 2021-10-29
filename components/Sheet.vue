<template>
	<div
		v-if="sheet"
		class="flex-grow-1"
	>
		<!--<EditorNavbar
			v-if="!visitor"
			:title-name="project.title"
			:title-extra-html-content="` - <nobr>${sheet.ord + 1} / ${project.sheets.length}</nobr>`"
			:dynamic-title="false"
		>
			<template #back-button-name>{{ project.title }}</template>
		</EditorNavbar>-->
		<!--<MapEditor
			v-if="sheet.features"
			:features="loadInitFeatures()"
			:visitor="visitor"
		>
			<template #feature-editor>
				<FeatureListContainer
					:visitor="visitor"
					:available-visitor-drawing-interactions="sheet.interactions"
					@addVisitorDrawingInteractions="addVisitorDrawingInteractions"
				/>
			</template>
		</MapEditor>-->
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
		<!--<b-navbar
			v-if="showBottomNav"
			class="justify-content-between fixed-bottom border-top"
			type="light"
			variant="white"
		>
			<b-navbar-nav>
				<div v-if="prevSheetExists()">
					<b-button
						variant="outline-secondary"
						:disabled="submitted"
						@click="goToOtherSheet(-1)"
					>
						<i class="fas fa-chevron-left mr-1" />
						<span class="d-none d-lg-inline">{{ getByOrd(sheet.ord - 1).title }}</span>
					</b-button>
				</div>
			</b-navbar-nav>
			<b-navbar-nav>
				<div>
					<b-button
						v-if="nextSheetExists()"
						variant="primary"
						:disabled="nextButtonDisabled"
						@click="goToOtherSheet(1)"
					>
						<span class="d-none d-md-inline">{{ getByOrd(sheet.ord + 1).title }}</span>
						<i class="fas fa-chevron-right ml-1" />
					</b-button>
					<b-button
						v-else-if="visitor"
						variant="success"
						:disabled="nextButtonDisabled || submitted"
						@click="submit"
					>
						Küldés
						<i class="fas fa-paper-plane ml-1" />
					</b-button>
				</div>
			</b-navbar-nav>
		</b-navbar>-->
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

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
		const sheet = this.project.sheets.filter(
			sheet => sheet.ord === parseInt(this.sheetOrd)
		)[0];

		return {
			contentModified: false,
			imageSource: null,
			sheet,
			showBottomNav: false,
			submitted: false,
			termsAndUseAccepted: this.visitor ? 'not_accepted' : null,
		};
	},
	computed: {
		...mapGetters({
			getAllFeature: 'features/getAllFeature',
		}),
		nextButtonDisabled() {
			if (this.visitor && this.firstSheet()) {
				return this.termsAndUseAccepted === 'not_accepted';
			} else {
				return false;
			}
		},
	},
	methods: {
		/**
		 * Gets sheet from DB by its order instead of is
		 * @returns {Object} sheet
		 */
		getByOrd(ord) {
			const sheet = this.project.sheets.filter(sheet => {
				return sheet.ord === ord;
			});
			return sheet[0];
		},
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
