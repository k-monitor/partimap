<template>
	<div>
		<b-navbar
			type="light"
			variant="white"
			class="justify-content-between fixed-top border-bottom shadow-sm"
		>
			<b-navbar-nav>
				<b-button class="back" variant="outline-secondary p-0" @click="$emit('back')">
					<div class="content d-flex">
						<div class="material-icons d-inline  border-info py-1 pl-1">
							arrow_back_ios_new
						</div>
						<div class="text d-inline p-1 pr-2">
							Térképek
						</div>
					</div>
				</b-button>
			</b-navbar-nav>
			<div class="map-name text-center">
				<b-navbar-nav v-if="!titleEdit" @click="titleEdit = true">
					<b-nav-text> <h3 class="my-0 text-dark">{{ mapTitle }}</h3></b-nav-text>
				</b-navbar-nav>
				<b-navbar v-if="titleEdit">
					<b-nav-form @submit="modifyMapName">
						<b-form-input v-model="localMapTitle" size="sm" class="mr-sm-2" />
						<b-button size="sm" class="mt-1 mt-sm-0 ml-auto" variant="outline-success" type="submit">Módosít</b-button>
					</b-nav-form>
				</b-navbar>
			</div>
			<!-- Right aligned nav items -->
			<b-navbar-nav>
				<b-button class="save" variant="outline-success p-0" :disabled="!mapModified" @click="$emit('save')">
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
		mapTitle: {
			type: String,
			default: null
		},
		mapModified: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			titleEdit: false,
			localMapTitle: this.mapTitle
		};
	},
	methods: {
		modifyMapName(event) {
			event.preventDefault();
			this.titleEdit = false;
			if (this.localMapTitle) {
				this.localMapTitle = this.localMapTitle.trim();
				this.$emit('updateTitle', this.localMapTitle);
				if (this.localMapTitle !== this.mapTitle) {
					this.$nuxt.$emit('mapChanged');
				}
			} else {
				this.localMapTitle = this.mapTitle; // if empty, use the previous
			}
		}
	}
};
</script>
