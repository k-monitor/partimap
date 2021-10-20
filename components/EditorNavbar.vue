<template>
	<div class="wrapper">
		<b-navbar
			type="light"
			variant="white"
			class="border-bottom fixed-top shadow-sm"
		>
			<div class="container-fluid">
				<b-navbar-nav>
					<b-nav-form>
						<b-button
							variant="outline-secondary"
							@click="$emit('back')"
						>
							<i class="fas fa-chevron-left mr-1" />
							<slot name="back-button-name">Vissza</slot>
						</b-button>
					</b-nav-form>
				</b-navbar-nav>

				<div class="d-flex flex-grow-1 justify-content-center nav-title">
					<div v-if="dynamicTitle">
						<b-navbar-nav
							v-if="!titleEdit"
							@click="titleEdit = true"
						>
							<b-nav-text class="editable-title font-weight-bold text-dark">
								{{ titleName }}
								<span v-html="titleExtraHtmlContent" />
							</b-nav-text>
						</b-navbar-nav>
						<b-navbar-nav v-else>
							<b-nav-form @submit="modifyTitle">
								<b-input-group>
									<b-form-input v-model="localTitle" />
									<template #append>
										<b-button
											class="mt-1 mt-sm-0 ml-auto"
											variant="success"
											type="submit"
										>Módosít</b-button>
									</template>
								</b-input-group>
							</b-nav-form>
						</b-navbar-nav>
					</div>
					<div v-else>
						<b-navbar-nav>
							<b-nav-text class="editable-title font-weight-bold text-dark">
								{{ titleName }}
								<span v-html="titleExtraHtmlContent" />
							</b-nav-text>
						</b-navbar-nav>
					</div>
				</div>

				<b-navbar-nav>
					<b-button
						variant="success"
						:disabled="!contentModified"
						@click="$emit('save')"
					>
						<i class="fas fa-save mr-1" />
						Mentés
					</b-button>
				</b-navbar-nav>
			</div>
		</b-navbar>
	</div>
</template>

<script>
export default {
	props: {
		titleName: {
			type: String,
			default: null,
		},
		titleExtraHtmlContent: {
			type: String,
			default: null,
		},
		dynamicTitle: {
			type: Boolean,
			default: false,
		},
		contentModified: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			titleEdit: false,
			localTitle: this.titleName,
		};
	},
	methods: {
		modifyTitle(event) {
			event.preventDefault();
			this.titleEdit = false;
			if (this.localTitle) {
				this.localTitle = this.localTitle.trim();
				this.$emit('updateTitle', this.localTitle);
				if (this.localTitle !== this.titleName) {
					this.$nuxt.$emit('contentModified');
				}
			} else {
				this.localTitle = this.titleName; // if empty, use the previous
			}
		},
	},
};
</script>

<style scoped>
.editable-title {
	cursor: pointer;
}
</style>
