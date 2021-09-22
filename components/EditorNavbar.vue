<template>
	<div class="wrapper">
		<b-navbar
			type="light"
			variant="white"
			class="justify-content-between fixed-top border-bottom shadow-sm py-2"
		>
			<div class="container-fluid">
				<div class="w-50 d-flex">
					<b-navbar-nav class="nav-back">
						<b-button class="back-button" variant="outline-secondary p-0" @click="$emit('back')">
							<div class="content d-flex align-items-center">
								<div class="material-icons d-inline  border-info py-1 pl-1">
									arrow_back_ios_new
								</div>
								<div class="text d-inline p-1 pr-2">
									<slot name="back-button-name">Vissza</slot>
								</div>
							</div>
						</b-button>
					</b-navbar-nav>
				</div>
				<div class="d-flex justify-content-center nav-title text-center w-50">
					<div v-if="dynamicTitle">
						<b-navbar-nav v-if="!titleEdit" @click="titleEdit = true">
							<b-nav-text> <h3 class="my-0 text-dark editable-title">{{ titleName }}<span v-html="titleExtraHtmlContent" /></h3></b-nav-text>
						</b-navbar-nav>
						<b-navbar v-if="titleEdit">
							<b-nav-form @submit="modifyTitle">
								<b-form-input v-model="localTitle" size="sm" class="mr-sm-2" />
								<b-button size="sm" class="mt-1 mt-sm-0 ml-auto" variant="outline-success" type="submit">Módosít</b-button>
							</b-nav-form>
						</b-navbar>
					</div>
					<div v-else>
						<b-navbar-nav>
							<b-nav-text> <h3 class="my-0 text-dark">{{ titleName }}<span v-html="titleExtraHtmlContent" /></h3></b-nav-text>
						</b-navbar-nav>
					</div>
				</div>
				<div class="d-flex justify-content-end w-50">
					<b-navbar-nav class="nav-save">
						<b-button class="save" variant="outline-success p-0" :disabled="!contentModified" @click="$emit('save')">
							<div class="content d-flex">
								<div class="material-icons d-inline  border-success py-1 pl-1">
									save
								</div>
								<div class="text d-inline p-1 pr-2">
									Mentés
								</div>
							</div>
						</b-button>
					</b-navbar-nav>
				</div>
			</div>
		</b-navbar>
	</div>
</template>

<script>
export default {
	props: {
		titleName: {
			type: String,
			default: null
		},
		titleExtraHtmlContent: {
			type: String,
			default: null
		},
		dynamicTitle: {
			type: Boolean,
			default: false
		},
		contentModified: {
			type: Boolean,
			default: false
		}
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
	}
};
</script>

<style scoped>
.editable-title {
	cursor: pointer;
}
</style>
