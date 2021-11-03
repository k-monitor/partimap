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
						type="text"
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
				<b-form-group label="Leírás">
					<b-textarea
						v-model="project.description"
						rows="5"
					/>
				</b-form-group>
				<b-form-group
					label="Adatvédelmi nyilatkozat"
					description="A látogatóknak az 1. munkalapon kell majd elfogadniuk ezt a továbblépés érdekében."
				>
					<b-textarea
						v-model="project.privacyPolicy"
						required
						rows="5"
					/>
				</b-form-group>
			</form>
			<template #footer>
				<div class="d-flex justify-content-end">
					<b-button
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
			newPassword: '',
			passwordModified: false,
		};
	},
	head() {
		return {
			title: `Admin: ${this.project.title}`,
		};
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
		async update() {
			try {
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
		async addSheet(title, type, sourceMap) {
			let initialFeatures = [];
			if (sourceMap) {
				const m = await this.$axios.$get('/api/map/' + sourceMap);
				initialFeatures = m.features;
			}

			const sheetData = {};
			sheetData.title = title;
			if (type.match(/poll$/i)) {
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
