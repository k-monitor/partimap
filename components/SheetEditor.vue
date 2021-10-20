<template>
	<b-card class="sheet-editor-container">
		<b-card-body
			class="p-0 pr-2"
			style="min-height: 200px;"
		>
			<div v-if="visitor">
				<h4 class="card-title">{{ localSheet.title }}</h4>
				<p class="card-text mb-4">{{ localSheet.description }}</p>
				<div
					v-if="socialButtons"
					class="d-flex justify-content-around"
				>
					<ShareNetwork
						v-for="s in social"
						:key="s.network"
						:network="s.network"
						:url="projectUrl"
						title=""
					>
						<i
							class="fa-fw"
							:class="s.icon"
						/>
					</ShareNetwork>
				</div>
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
			<div v-else>
				<b-form-group>
					<b-form-input
						v-model="localSheet.title"
						placeholder="Cím"
						size="lg"
					/>
				</b-form-group>
				<b-form-group>
					<b-textarea
						v-model="localSheet.description"
						class="form-control"
						maxlength="1000"
						placeholder="Leírás"
						rows="6"
					/>
					<span
						v-if="!visitor"
						class="badge badge-secondary"
					>{{ descriptionLength }} / 1000</span>
				</b-form-group>

				<div v-if="!localSheet.features">
					<b-form
						v-if="!localSheet.image"
						@submit.prevent="submitFile"
					>
						<b-form-group
							invalid-feedback="Maximális fájlméret: 5 MB"
							:state="imageState"
						>
							<b-input-group>
								<b-form-file
									ref="file-selector"
									v-model="backgroundImage"
									:state="imageState"
									accept="image/jpeg, image/png, image/webp"
									drop-placeholder="Húzza ide a fájlt!"
									placeholder="Kép tallózása..."
								/>
								<template #append>
									<b-button
										:disabled="!backgroundImage"
										variant="success"
										type="submit"
									>
										<i class="fas fa-upload" />
									</b-button>
								</template>
							</b-input-group>
						</b-form-group>
					</b-form>
					<b-form-group v-else>
						<b-button
							class="w-100"
							variant="danger"
							@click="showConfirmModal"
						>
							Kép törlése
						</b-button>
					</b-form-group>
				</div>

				<!-- <b-button
					v-if="localSheet.survey"
					variant="success"
				>
					Kérdőív szerkesztése
				</b-button> -->

				<div
					v-if="!localSheet.features && !localSheet.survey"
					class="form-group"
				>
					<b-form-checkbox v-model="socialButtons">
						Megosztás gombok
					</b-form-checkbox>
				</div>
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
const SOCIAL_SHARING = 'SocialSharing';

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
			backgroundImage: null,
			imageState: null,
			socialButtons: (this.sheet.interactions || '').includes(SOCIAL_SHARING),
			social: [
				{ network: 'facebook', icon: 'fab fa-facebook-f'.split(' ') },
				{ network: 'twitter', icon: 'fab fa-twitter'.split(' ') },
				{ network: 'email', icon: 'fas fa-envelope'.split(' ') },
			],
		};
	},
	computed: {
		descriptionLength() {
			return this.localSheet.description
				? this.localSheet.description.length
				: 0;
		},
		nextButtonDisabled() {
			if (this.visitor && this.firstSheet()) {
				return this.termsAndUseAccepted === 'not_accepted';
			} else {
				return false;
			}
		},
		projectUrl() {
			return window.location.href.replace(/\/\d+\/?/, '');
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
		backgroundImage(val) {
			// clear validation error message on file removal
			if (!val) {
				this.imageState = null;
			}
		},
		sheet(val) {
			this.localSheet = val;
		},
		socialButtons(val) {
			const i = JSON.parse(this.localSheet.interactions || '[]');
			if (val) {
				i.push(SOCIAL_SHARING);
				this.localSheet.interactions = JSON.stringify(i);
			} else {
				this.localSheet.interactions = JSON.stringify(
					i.filter(e => e !== SOCIAL_SHARING)
				);
			}
			this.$emit('sheetInteractionsChanged', this.localSheet.interactions);
			this.$nuxt.$emit('contentModified');
		},
		'localSheet.description'(val) {
			this.$emit('sheetDescriptionChanged', val);
			this.$nuxt.$emit('contentModified');
		},
		'localSheet.title'(val) {
			this.$emit('sheetTitleChanged', val);
			this.$nuxt.$emit('contentModified');
		},
	},
	methods: {
		checkFileValidity() {
			// Filesize: max 5MB
			const valid = this.backgroundImage.size < 5 * 1024 * 1024;
			this.imageState = valid;
			return valid;
		},
		submitFile() {
			if (!this.checkFileValidity()) {
				return;
			}
			this.$emit('uploadImage', this.backgroundImage);
		},
		showConfirmModal() {
			this.$bvModal
				.msgBoxConfirm('Biztosan törli a háttérképet?', {
					title: 'Megerősítés',
					size: 'sm',
					buttonSize: 'sm',
					okVariant: 'danger',
					okTitle: 'Igen',
					cancelTitle: 'Mégsem',
					footerClass: 'p-2',
					hideHeaderClose: false,
					centered: true,
					autoFocusButton: 'ok',
				})
				.then(value => {
					if (value) {
						this.deleteBackgroundImage();
					}
				})
				.catch(err => {
					console.warn(err.message);
					this.errorToast('Sikertelen törlés.');
				});
		},
		deleteBackgroundImage() {
			this.localSheet.image = null;
			this.backgroundImage = null;
			this.$emit('backgroundImageDeleted', this.localSheet);

			this.imageState = null;
		},
		firstSheet() {
			return !this.sheet.ord;
		},
	},
};
</script>

<style scoped>
.sheet-editor-container {
	width: 250px;
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
