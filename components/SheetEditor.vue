<template>
	<b-card class="sheet-editor-container">
		<template #header>
			<div v-if="!titleEdit" @click="titleEdit = true">
				<h5 class="my-0 editable-title text-center">{{ localSheet.title }}</h5>
			</div>
			<div v-else>
				<b-form id="sheetNameForm" @submit.prevent="update">
					<b-form-input v-model="localSheet.title" size="sm" class="mr-sm-2" />
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
					/>
					<span class="badge badge-secondary char-count">{{ descriptionLength }} / 1000</span>
				</div>
			</b-form>
			<div ref="sidebar-collapse" class="sidebar-button sidebar-collapse">
				<a href="#" @click="$emit('collapse',$refs['sidebar-collapse'])">
					<svg width="13" height="150">
						<path
							d=" M 13 150 L 0 135 L 0 15 L 13 0"
							fill="rgb(247,247,247)"
							stroke="rgb(223,223,223)"
						/>
						<path
							d="M 13 0 L 13 150"
						/>
					</svg>
				</a>
				<span class="material-icons collapse-icon">
					expand_more
				</span>
			</div>
			<hr>
			<div v-if="!sheet.image && !sheet.features" class="image-selector">
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
						<b-col cols="auto" class="pl-0 ">
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
			<div v-if="sheet.image" class="delete-image">
				<b-button class="w-100" size="sm" variant="danger" @click="showConfirmModal">Háttérkép eltávolítása</b-button>
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
			<b-button v-if="prevBtnEnabled" size="sm" class="float-left" @click="$emit('prevSheet')">Vissza</b-button>
			<b-button v-if="nextBtnEnabled" size="sm" class="float-right" @click="$emit('nextSheet')">Tovább</b-button>
		</template>
	</b-card>
</template>

<script>
export default {
	props: {
		sheet: {}, // TODO
		nextBtnEnabled: {
			type: Boolean,
			default: false
		},
		prevBtnEnabled: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			localSheet: this.sheet,
			titleEdit: false,
			backgroundImage: null,
			imageState: null
		};
	},
	computed: {
		descriptionLength() {
			return this.localSheet.description ? this.localSheet.description.length : 0;
		}
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
		'localSheet.description' (val) {
			this.$emit('sheetDescriptionChanged', val);
			this.$nuxt.$emit('contentModified');
		},
		'localSheet.title' (val) {
			this.$emit('sheetTitleChanged', val);
			this.$nuxt.$emit('contentModified');
		},
	},
	methods: {
		update() {
			this.titleEdit = false;
		},
		checkFileValidity() {
			// Filesize: max 5MB
			const valid = (this.backgroundImage.size < 5 * 1024 * 1024);
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
			this.$bvModal.msgBoxConfirm('Biztosan törli a háttérképet?', {
				title: 'Megerősítés',
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'IGEN',
				cancelTitle: 'MÉGSEM',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true,
				autoFocusButton: 'ok'
			})
				.then(value => {
					if (value) {
						this.deleteBackgroundImage();
					}
				})
				.catch(err => {
					console.warn(err.message);
					this.error('Sikertelen törlés.');
				});
		},
		deleteBackgroundImage() {
			this.localSheet.image = '';
			this.backgroundImage = null;
			this.update();
			this.imageState = null;
		}
	}
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
.sidebar-button:hover path{
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
