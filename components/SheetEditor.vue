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
				@submit.prevent="update"
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
				<div class="d-flex justify-content-end">
					<b-button
						variant="outline-primary"
						form="sheetForm"
						type="submit"
						size="sm"
					>
						Mentés
					</b-button>
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
			<b-button
				v-if="!localSheet.features"
				size="sm"
				class="w-100"
				variant="success"
			>
				<div class="content d-flex">
					<div class="material-icons d-inline pr-1">
						image
					</div>
					<div class="text d-inline">
						Háttérkép hozzáadása
					</div>
				</div>
			</b-button>
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
			titleEdit: false
		};
	},
	computed: {
		descriptionLength() {
			return this.localSheet.description ? this.localSheet.description.length : 0;
		}
	},
	methods: {
		update() {
			this.$emit('sheetChanged', this.localSheet);
			this.titleEdit = false;
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

#description {
	resize: none;
}
</style>
