<template>
	<b-card class="sheet-editor-container">
		<b-card-body>
			<form
				id="sheetForm"
				@submit.prevent="update"
			>
				<div class="form-group">
					<label for="title">Munkalap elnevezése</label>
					<input
						id="title"
						v-model="localSheet.title"
						class="form-control"
						type="text"
					>
				</div>
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
			</form>
		</b-card-body>
	</b-card>
</template>

<script>
export default {
	props: {
		sheet: {} // TODO
	},
	data() {
		return {
			localSheet: this.sheet
		};
	},
	methods: {
		update() {
			this.$emit('sheetChanged', this.localSheet);
		}
	}
};

</script>

<style>

.sheet-editor-container {
	top: 120px;
	height: 400px;
	width: 250px;
}
</style>
