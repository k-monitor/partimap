<template>
	<div>
		<b-navbar
			type="light"
			variant="white"
			class="justify-content-between fixed-top border-bottom shadow-sm"
		>
			<b-navbar-nav>
				<b-button class="back" variant="outline-secondary p-0" @click="$emit('back')">
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
			<div class="title text-center">
				<div v-if="dynamicTitle">
					<b-navbar-nav v-if="!titleEdit" @click="titleEdit = true">
						<b-nav-text> <h3 class="my-0 text-dark editable-title">{{ title }}</h3></b-nav-text>
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
						<b-nav-text> <h3 class="my-0 text-dark">{{ title }}</h3></b-nav-text>
					</b-navbar-nav>
				</div>
			</div>
			<b-navbar-nav>
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
		</b-navbar>
	</div>
</template>

<script>
export default {
	props: {
		title: {
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
			localTitle: this.title,
		};
	},
	methods: {
		modifyTitle(event) {
			event.preventDefault();
			this.titleEdit = false;
			if (this.localTitle) {
				this.localTitle = this.localTitle.trim();
				this.$emit('updateTitle', this.localTitle);
				if (this.localTitle !== this.title) {
					this.$nuxt.$emit('contentModified');
				}
			} else {
				this.localTitle = this.title; // if empty, use the previous
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
