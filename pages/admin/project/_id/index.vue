<template>
	<div>
		<AdminFrame>
			<template #header>
				<div class="d-flex">
					<div>
						<NuxtLink to="/admin/projects">Projektek</NuxtLink>
						<span class="text-muted">&raquo;</span>
						{{ project.title }}
					</div>
					<b-button
						:to="'/p/' + (project.slug || project.id) + '/0'"
						class="ml-auto"
						target="_blank"
						variant="primary"
					>
						Megtekintés
					</b-button>
				</div>
			</template>
			<form
				id="projectForm"
				@submit.prevent="update"
			>
				<b-form-group label="Projekt címe">
					<b-form-input
						v-model="project.title"
						required
					/>
				</b-form-group>
				<b-form-group
					label="Elérési útvonal"
					description="Mentéskor a rendszer módosíthatja a fent beírt értéket, ha már van ilyen útvonal."
				>
					<b-input-group prepend="/p/">
						<b-form-input
							v-model="project.slug"
							:placeholder="generateSlug()"
						/>
						<template #append>
							<b-button
								v-b-tooltip.hover
								title="Generálás projekt címéből"
								variant="outline-primary"
								@click="project.slug = generateSlug()"
							>
								<i class="fas fa-magic fa-fw" />
							</b-button>
						</template>
					</b-input-group>
				</b-form-group>
				<b-form-group
					label="Jelszavas védelem"
					description="Ha be vagy jelentkezve, a saját projektjeid nem fognak jelszót kérni. Inkognitó/privát módban tudod tesztelni a védelmet."
				>
					<b-input-group>
						<template #append>
							<b-button
								v-if="project.password"
								variant="danger"
								@click="resetPassword"
							>
								<i class="fas fa-backspace" />
							</b-button>
						</template>
						<b-form-input
							v-model="newPassword"
							:placeholder="project.password ? 'Be van állítva' : 'Új jelszó'"
							:readonly="project.password"
							type="password"
							@change="passwordModified = true"
						/>
					</b-input-group>
				</b-form-group>
				<b-form-group
					label="Meta leírás (Facebook előnézeti szöveg)"
					:description="(project.description || '').length + '/200'"
				>
					<b-textarea
						v-model="project.description"
						maxlength="200"
					/>
				</b-form-group>
				<b-form-group
					invalid-feedback="Maximális fájlméret: 5 MB"
					label="Facebook bélyegkép (ajánlott méret: 1200x630 pixel)"
					:state="imageState"
				>
					<b-input-group v-if="!project.image">
						<b-form-file
							v-model="image"
							accept="image/jpeg, image/png, image/webp"
							class="project-image-input"
							browse-text=""
							drop-placeholder="Húzd ide a fájlt!"
							placeholder="Kép tallózása..."
							:state="imageState"
						/>
						<template #append>
							<b-button
								:disabled="!image"
								variant="outline-danger"
								@click="removeImage"
							>
								<i class="fas fa-backspace" />
							</b-button>
						</template>
					</b-input-group>
					<div v-else>
						<figure class="figure">
							<img
								:src="project.image"
								alt="Facebook bélyegkép"
								class="figure-img rounded"
								height="120"
							>
							<figcaption class="figure-caption">
								<a
									class="text-danger"
									href="javascript:void(0)"
									@click="removeImage"
								>Kép törlése</a>
							</figcaption>
						</figure>
					</div>
				</b-form-group>
				<b-form-group
					class="rich"
					label="Adatkezelő elérhetősége"
					description="Az Adatkezelési tájékoztatóban jelenik meg kapcsolatfelvételi adatként. Ezt a látogatóknak az 1. munkalapon kell majd elfogadniuk."
					invalid-feedback="Kötelező megadni!"
					:state="isPrivacyPolicyValid"
				>
					<client-only>
						<tiptap v-model="project.privacyPolicy" />
					</client-only>
				</b-form-group>
				<b-form-group
					class="rich"
					label="Köszönetnyilvánítás"
					description="A látogatóknak az utolsó munkalapon fog megjelenni, beküldés után."
				>
					<client-only>
						<tiptap v-model="project.thanks" />
					</client-only>
				</b-form-group>
				<b-form-group
					label="Tovább URL"
					description="A köszönetnyilvánítás alatt megjelenő Tovább gomb erre fog linkelni."
				>
					<b-form-input v-model="project.thanksUrl" />
				</b-form-group>
				<b-form-group>
					<b-form-checkbox
						v-model="project.thanksSocial"
						value="1"
					>
						Megosztás gombok a köszönetnyilvánítás alatt.
					</b-form-checkbox>
				</b-form-group>
			</form>
			<template #footer>
				<div class="d-flex justify-content-end">
					<b-button
						:disabled="!isPrivacyPolicyValid"
						form="projectForm"
						type="submit"
						variant="success"
					>
						Mentés
					</b-button>
				</div>
			</template>
		</AdminFrame>
		<ProjectSheetManager
			:project="project"
			:project-id="project.id"
			:sheets="project.sheets"
			@addSheet="addSheet"
			@delSheet="delSheet"
			@moveSheet="moveSheet"
		/>
	</div>
</template>

<script>
import { orderBy } from 'lodash';
import slugify from 'slugify';

export default {
	middleware: ['auth'],
	async asyncData({ $axios, params, redirect }) {
		try {
			const project = await $axios.$get('/api/project/' + params.id);
			const sfcs = await $axios.$get(
				'/api/submission/feature-counts/' + params.id
			);
			project.sheets.forEach((s, i) => {
				project.sheets[i].submittedFeatureCount = Number(sfcs[s.id] || 0);
			});
			return { project };
		} catch (err) {
			redirect('/admin/projects');
			// TODO error üzenet
		}
	},
	data() {
		return {
			image: null,
			imageState: null,
			newPassword: '',
			passwordModified: false,
		};
	},
	head() {
		return {
			title: `Admin: ${this.project.title}`,
		};
	},
	computed: {
		isPrivacyPolicyValid() {
			const len = (this.project.privacyPolicy || '').replace(
				/(<[^>]*>|\s+)/g,
				''
			).length;
			return len > 10;
		},
	},
	watch: {
		image(val) {
			this.imageData = null;
			if (!val) {
				// clear validation error message on file removal
				this.imageState = null;
			} else {
				const valid = this.image.size < 5 * 1024 * 1024;
				this.imageState = valid;
			}
		},
	},
	methods: {
		generateSlug() {
			return slugify(this.project.title);
		},
		resetPassword() {
			this.project.password = false;
			this.newPassword = '';
			this.passwordModified = true;
		},
		removeImage() {
			this.image = null;
			this.project.image = null;
		},
		async update() {
			try {
				if (this.image) {
					await this.uploadImage();
				}
				const p = { ...this.project };
				if (!this.passwordModified) {
					delete p.password;
				} else {
					p.newPassword = this.newPassword;
				}
				this.project = await this.$axios.$patch('/api/project', p);
				this.newPassword = '';
				this.passwordModified = false;
				this.success('Módosítás sikeres.');
			} catch (error) {
				this.errorToast('Módosítás sikertelen.');
			}
		},
		async uploadImage() {
			if (!this.imageState) {
				return;
			}
			const formData = new FormData();
			formData.append('image', this.image);
			try {
				this.project = await this.$axios.$put(
					'/api/project/' + this.project.id + '/image',
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				);
				this.image = null;
			} catch (error) {
				this.errorToast('Kép feltöltése sikertelen.');
			}
		},
		async addSheet(title, type, sourceMap) {
			let initialFeatures = [];
			if (sourceMap) {
				const m = await this.$axios.$get('/api/map/' + sourceMap);
				initialFeatures = m.features;
			}

			const sheetData = {};
			sheetData.title = title;
			if (type === 'survey') {
				sheetData.survey = {};
			} else if (type.match(/map$/i)) {
				// staticMap / interactiveMap
				sheetData.features = initialFeatures;
				if (type.startsWith('interactive')) {
					// interactiveMap
					sheetData.interactions = ['Point'];
				} else {
					// staticMap has optional survey too
					sheetData.survey = {};
				}
			}

			try {
				const newSheet = await this.$axios.$put(
					'/api/project/' + this.project.id + '/sheet',
					sheetData
				);
				this.project.sheets.push(newSheet);
			} catch (error) {
				this.errorToast('Munkalap hozzáadása sikertelen.');
			}
		},
		async delSheet(sheet) {
			try {
				await this.$axios.$delete('/api/sheet/' + sheet.id);
			} catch (error) {
				this.errorToast('Munkalap törlése sikertelen.');
			}
			this.project.sheets = this.project.sheets.filter(function (s) {
				if (s.id !== sheet.id) {
					if (s.ord > sheet.ord) {
						s.ord--;
					}
					return true;
				} else {
					return false;
				}
			});
		},
		async moveSheet(dir, sheet) {
			let otherSheet; // with which the current element is switched
			if (dir === 'down') {
				this.project.sheets.forEach(element => {
					if (element.ord === sheet.ord + 1) {
						otherSheet = element;
					}
				});
				otherSheet.ord--;
				sheet.ord++;
				this.project.sheets = orderBy(this.project.sheets, 'ord', 'asc');
			} else if (dir === 'up') {
				this.project.sheets.forEach(element => {
					if (element.ord === sheet.ord - 1) {
						otherSheet = element;
					}
				});
				otherSheet.ord++;
				sheet.ord--;
				this.project.sheets = orderBy(this.project.sheets, 'ord', 'asc');
			}
			try {
				await this.$axios.$patch('/api/sheet/', {
					id: sheet.id,
					ord: sheet.ord,
				});
			} catch (error) {
				this.errorToast('Munkalap mozgatása sikertelen.');
			}
		},
	},
};
</script>

<style>
.project-image-input .custom-file-label::after {
	/* does not work in scoped style block */
	display: none !important;
}
</style>
