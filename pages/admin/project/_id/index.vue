<template>
	<div>
		<AdminFrame>
			<template #header>
				<NuxtLink to="/admin/projects">Projektek</NuxtLink>
				<span class="text-muted">&raquo;</span>
				{{ project.title }}
			</template>
			<form
				id="projectForm"
				@submit.prevent="update"
			>
				<div class="form-group">
					<label for="title">Projekt elnevezése</label>
					<input
						id="title"
						v-model="project.title"
						class="form-control"
						required
						type="text"
					>
				</div>
				<div class="form-group">
					<label for="description">Leírás</label>
					<textarea
						id="description"
						v-model="project.description"
						class="form-control"
						rows="5"
					/>
				</div>
			</form>
			<template #footer>
				<div class="d-flex justify-content-end">
					<button
						class="btn btn-outline-primary"
						form="projectForm"
						type="submit"
					>
						Mentés
					</button>
				</div>
			</template>
		</AdminFrame>
		<ProjectSheetManager
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

export default {
	middleware: ['auth'], // Ez micsoda?
	async asyncData({ $axios, params, redirect }) {
		try {
			const project = await $axios.$get('/api/project/' + params.id);
			return { project };
		} catch (err) {
			redirect('/admin/projects');
			// TODO error üzenet
		}
	},
	head() {
		return {
			title: 'Admin: ' + this.project.title,
		};
	},
	methods: {
		async update() {
			try {
				await this.$axios.$patch('/api/project', this.project);
				this.success('Módosítás sikeres.');
			} catch (error) {
				this.error('Módosítás sikertelen.');
			}
		},
		async addSheet(title, type) {
			const sheetData = {};
			sheetData.title = title;
			switch (type) {
			case 'poll':
				sheetData.survey = {};
				break;
			case 'staticMap':
				sheetData.features = [];
				break;
			case 'interactiveMap':
				sheetData.features = [];
				break;
			case 'demographicsPoll':
				sheetData.survey = {};
				break;
			default:
				break;
			}
			try {
				const newSheet = await this.$axios.$put('/api/project/' + this.project.id + '/sheet', sheetData);
				this.project.sheets.push(newSheet);
			} catch (error) {
				this.error('Munkalap hozzáadása sikertelen.');
			}
		},
		async delSheet(sheet) {
			try {
				await this.$axios.$delete('/api/sheet/' + sheet.id);
			} catch (error) {
				this.error('Munkalap törlése sikertelen.');
			}
			this.project.sheets = this.project.sheets.filter(function(s) {
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
					if (element.ord === (sheet.ord + 1)) {
						otherSheet = element;
					}
				});
				otherSheet.ord--;
				sheet.ord++;
				this.project.sheets = orderBy(this.project.sheets, 'ord', 'asc');
			} else if (dir === 'up') {
				this.project.sheets.forEach(element => {
					if (element.ord === (sheet.ord - 1)) {
						otherSheet = element;
					}
				});
				otherSheet.ord++;
				sheet.ord--;
				this.project.sheets = orderBy(this.project.sheets, 'ord', 'asc');
			}
			try {
				await this.$axios.$patch('/api/sheet/', { id: sheet.id, ord: sheet.ord });
			} catch (error) {
				this.error('Munkalap mozgatása sikertelen.');
			}
		}
	}
};
</script>
