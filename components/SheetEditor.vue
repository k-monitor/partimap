<template>
	<b-card class="sheet-editor-container">
		<template #header>
			<div
				v-if="!titleEdit"
				@click="editTitle"
			>
				<h5
					class="my-0 text-center"
					:class="{visitor: 'editable-title'}"
				>
					{{ localSheet.title }}
				</h5>
			</div>
			<div v-else>
				<b-form
					id="sheetNameForm"
					@submit.prevent="titleEdit = false;"
				>
					<b-form-input
						v-model="localSheet.title"
						size="sm"
						class="mr-sm-2"
					/>
					<b-button
						size="sm"
						class="mt-1 mt-sm-0 ml-auto"
						variant="outline-success"
						type="submit"
						form="sheetNameForm"
					>
						Módosít
					</b-button>
				</b-form>
			</div>
		</template>
		<b-card-body class="p-0">
			<b-form
				id="sheetForm"
				class="pb-1"
				@submit.prevent=""
			>
				<div class="form-group">
					<label for="description">Leírás:</label>
					<b-textarea
						id="description"
						v-model="localSheet.description"
						class="form-control"
						rows="6"
						maxlength="1000"
						:readonly="visitor"
					/>
					<span
						v-if="!visitor"
						class="badge badge-secondary char-count"
					>{{ descriptionLength }} / 1000</span>
				</div>
				<div class="form-group">
					<b-form-checkbox
						v-if="visitor && firstSheet()"
						id="checkbox-1"
						v-model="termsAndUseAcceptedLocal"
						name="checkbox-1"
						value="accepted"
						unchecked-value="not_accepted"
					>
						<small>
							Elfogadom az
							<a
								href="#"
								@click="$bvModal.show('terms-and-use-modal')"
							>
								Adatvédelmi Nyilatkozatot.
							</a>
						</small>
					</b-form-checkbox>
				</div>
				<div v-if="visitor">
					<div
						v-if="socialButtons"
						class="d-flex justify-content-around mb-3"
					>
						<ShareNetwork
							v-for="s in social"
							:key="s.network"
							:network="s.network"
							:url="projectUrl"
							hashtags="vuejs,vite"
						>
							<i
								class="fa-fw fa-2x"
								:class="s.icon"
							/>
						</ShareNetwork>
					</div>
				</div>
				<div
					v-else
					class="form-group"
				>
					<b-form-checkbox v-model="socialButtons">
						Megosztás gombok
					</b-form-checkbox>
				</div>
			</b-form>
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
			<div
				v-if="!sheet.image && !sheet.features && !visitor"
				class="image-selector"
			>
				<b-form @submit.prevent="submitFile">
					<b-row>
						<b-col class="pr-1">
							<b-form-group
								invalid-feedback="Maximális fájlméret: 5MB"
								:state="imageState"
								class="m-0"
							>
								<b-form-file
									ref="file-selector"
									v-model="backgroundImage"
									:state="imageState"
									accept="image/jpeg, image/png, image/webp"
									placeholder="Kép kiválasztása..."
									drop-placeholder="Húzza ide a fájlt..."
									size="sm"
								/>
							</b-form-group>
						</b-col>
						<b-col
							cols="auto"
							class="pl-0 "
						>
							<b-button
								variant="outline-success"
								size="sm"
								:disabled="!backgroundImage"
								class="pb-0 px-1"
								type="submit"
							>
								<span class="material-icons">
									check
								</span>
							</b-button>
						</b-col>
					</b-row>
				</b-form>
			</div>
			<div
				v-if="sheet.image && !visitor"
				class="delete-image"
			>
				<b-button
					class="w-100"
					size="sm"
					variant="danger"
					@click="showConfirmModal"
				>
					Háttérkép eltávolítása
				</b-button>
			</div>
			<b-button
				v-if="localSheet.survey"
				size="sm"
				class="w-100 mt-1"
				variant="success"
			>
				<div class="content d-flex">
					<div class="material-icons d-inline pr-1">
						poll
					</div>
					<div class="text d-inline">
						Kérdőív szerkesztése
					</div>
				</div>
			</b-button>
		</b-card-body>
		<template #footer>
			<b-button
				v-if="prevBtnShown"
				size="sm"
				class="float-left"
				@click="$emit('prevSheet')"
			>
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
					size="sm"
					@click="$emit('nextSheet')"
				>
					Tovább
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
	},
	data() {
		return {
			localSheet: this.sheet,
			titleEdit: false,
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
					okTitle: 'IGEN',
					cancelTitle: 'MÉGSEM',
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
		editTitle() {
			if (!this.visitor) {
				this.titleEdit = true;
			}
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

.card-footer {
	padding: 0.5rem;
}

.editable-title {
	cursor: pointer;
}

.char-count {
	position: absolute;
	margin-top: 2px;
	font-size: 60%;
}
.image-selector .material-icons {
	font-size: 20px;
}

#description {
	resize: none;
}
</style>

<style>
.custom-file-input:lang(en) ~ .custom-file-label::after {
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
.side-footer {
	height: 100px;
}
</style>
