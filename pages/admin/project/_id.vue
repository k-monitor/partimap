<template>
	<div>
		<AdminFrame>
			<template #header>
				<NuxtLink to="/admin/projects">Projektek</NuxtLink>
				<span class="text-muted">&raquo;</span>
				{{ p.title }}
			</template>
			<form
				id="projectForm"
				@submit.prevent="update"
			>
				<div class="form-group">
					<label for="title">Projekt elnevezése</label>
					<input
						id="title"
						v-model="m.title"
						class="form-control"
						required
						type="text"
					>
				</div>
				<div class="form-group">
					<label for="descriptoin">Leírás</label>
					<textarea
						id="description"
						v-model="m.description"
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
			:project-id="p.id"
			:sheets="localSheets"
			@addSheet="addSheet"
			@delSheet="delSheet"
			@moveSheet="moveSheet"
		/>
	</div>
</template>

<script>
import { orderBy } from 'lodash';

export default {
	middleware: ['auth'],
	async asyncData({ $axios, params, redirect }) {
		try {
			const p = await $axios.$get('/api/project/' + params.id);
			const sheets = await $axios.$get('/api/project/' + params.id + '/sheets');
			return { p, m: { ...p }, sheets, localSheets: [...sheets] };
		} catch (err) {
			redirect('/admin/projects');
		}
	},
	head() {
		return {
			title: 'Admin: ' + this.p.title,
		};
	},
	methods: {
		async update() {
			try {
				this.p = await this.$axios.$patch('/api/project', this.m);
				this.m = { ...this.p };
				this.success('Módosítás sikeres');
			} catch (error) {
				this.error('Módosítás sikertelen');
			}
		},
		async addSheet(title) {
			try {
				const newSheet = await this.$axios.$put('/api/project/' + this.p.id + '/sheet', {
					title
				});
				this.localSheets.push(newSheet);
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
			this.localSheets = this.localSheets.filter(function(s) {
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
				this.localSheets.forEach(element => {
					if (element.ord === (sheet.ord + 1)) {
						otherSheet = element;
					}
				});
				otherSheet.ord--;
				sheet.ord++;
				this.localSheets = orderBy(this.localSheets, 'ord', 'asc');
			} else if (dir === 'up') {
				this.localSheets.forEach(element => {
					if (element.ord === (sheet.ord - 1)) {
						otherSheet = element;
					}
				});
				otherSheet.ord++;
				sheet.ord--;
				this.localSheets = orderBy(this.localSheets, 'ord', 'asc');
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
