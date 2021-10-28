<template>
	<b-card class="sheet-editor-container">
		<b-card-body
			class="p-0 pr-2"
			style="min-height: 200px;"
		>
			<div v-if="visitor">
				<b-form-checkbox
					v-if="firstSheet()"
					v-model="termsAndUseAcceptedLocal"
					class="mt-4"
					value="accepted"
					unchecked-value="not_accepted"
				>
					Elfogadom az
					<a
						href="#"
						@click="$bvModal.show('terms-and-use-modal')"
					>
						Adatvédelmi Nyilatkozatot.
					</a>
				</b-form-checkbox>
			</div>
			<div
				ref="sidebar-collapse"
				class="sidebar-button sidebar-collapse"
			>
				<a
					href="#"
					@click="$emit('collapse',$refs['sidebar-collapse'])"
				>
					<svg
						width="13"
						height="150"
					>
						<path
							d=" M 13 150 L 0 135 L 0 15 L 13 0"
							fill="rgb(247,247,247)"
							stroke="rgb(223,223,223)"
						/>
						<path d="M 13 0 L 13 150" />
					</svg>
				</a>
				<span class="material-icons collapse-icon">
					expand_more
				</span>
			</div>
		</b-card-body>
		<template #footer>
			<b-button
				v-if="prevBtnShown"
				class="float-left"
				variant="outline-secondary"
				:disabled="submitted"
				@click="$emit('prevSheet')"
			>
				<i class="fas fa-chevron-left mr-1" />
				Vissza
			</b-button>
			<span
				id="disabled-wrapper"
				v-b-tooltip="{
					title: 'Az Adatvédelmi Nyilatkozatot el kell fogadni.',
					disabled: !nextButtonDisabled
				}"
				class="d-inline-block float-right"
				tabindex="0"
			>
				<b-button
					v-if="nextBtnShown"
					:disabled="nextButtonDisabled"
					variant="primary"
					@click="$emit('nextSheet')"
				>
					Tovább
					<i class="fas fa-chevron-right ml-1" />
				</b-button>
				<b-button
					v-else-if="visitor"
					:disabled="nextButtonDisabled || submitted"
					variant="success"
					@click="$emit('submit')"
				>
					Küldés
					<i class="fas fa-paper-plane ml-1" />
				</b-button>
			</span>
		</template>

		<b-modal
			id="terms-and-use-modal"
			scrollable
			title="Adatvédelmi Nyilatkozat"
			ok-title="Elfogadom"
			cancel-title="Vissza"
			ok-variant="success"
			@ok="$emit('toggleTermsAndUseAccepted','accepted')"
		>
			<p
				v-for="i in 20"
				:key="i"
				class="my-4"
			>
				Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
				in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
			</p>
		</b-modal>
	</b-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	props: {
		sheet: {
			type: Object,
			default: null,
		},
		nextBtnShown: {
			type: Boolean,
			default: false,
		},
		prevBtnShown: {
			type: Boolean,
			default: false,
		},
		visitor: {
			type: Boolean,
			default: false,
		},
		termsAndUseAccepted: {
			type: String,
			default: 'not_accepted',
		},
		submitted: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			localSheet: this.sheet,
		};
	},
	computed: {
		...mapGetters({
			getVisitorAnswers: 'visitordata/getVisitorAnswers',
		}),
		visitorAnswers: {
			get() {
				return this.getVisitorAnswers(this.sheet.id);
			},
			set(answers) {
				const payload = {
					answers,
					sheetId: this.sheet.id,
				};
				this.$store.commit('visitordata/addAnswers', payload);
			},
		},
		nextButtonDisabled() {
			if (this.visitor && this.firstSheet()) {
				return this.termsAndUseAccepted === 'not_accepted';
			} else {
				return false;
			}
		},
		termsAndUseAcceptedLocal: {
			get() {
				return this.termsAndUseAccepted;
			},
			set(val) {
				this.$emit('toggleTermsAndUseAccepted', val);
			},
		},
	},
	watch: {
		sheet(val) {
			this.localSheet = val;
		},
	},
	methods: {
		firstSheet() {
			return !this.sheet.ord;
		},
	},
};
</script>

<style scoped>
.sheet-editor-container {
	width: 100%;
}

textarea {
	resize: none;
}
</style>

<style>
.custom-file-input ~ .custom-file-label::after {
	display: none;
}
.sidebar-button {
	position: absolute;
	top: 50%;
}
.sheet-sidebar .sidebar-button.sidebar-expand {
	left: 0;
	top: 0;
	visibility: hidden;
	transform: translate(0, -50%);
}
.sidebar-button.sidebar-collapse {
	transform: translate(0, -50%);
}
.sheet-sidebar .sidebar-button.sidebar-collapse {
	right: 0;
}
.sidebar-button:hover path {
	fill: rgb(223, 223, 223);
}
.sidebar-button .collapse-icon {
	position: absolute;
	font-size: 15px;
	font-weight: 700;
	top: 50%;
	transform: translate(-15px, -50%) rotate(90deg);
	pointer-events: none;
}
</style>
