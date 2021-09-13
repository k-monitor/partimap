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
		<b-card-body>
			<b-form
				id="sheetForm"
				@submit.prevent="update"
			>
				<div class="form-group">
					<label for="description">Leírás</label>
					<textarea
						id="description"
						v-model="localSheet.description"
						class="form-control"
						rows="5"
					/>
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
			<div class="sidebar-button sidebar-collapse">
				<a v-b-toggle.sheet-sidebar href="#">
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
	height: 400px;
	width: 250px;
}

.card-footer {
	padding: 0.5rem;
}

.editable-title {
	cursor: pointer;
}
</style>
