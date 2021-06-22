<template>
	<div class="container-fluid mt-5">
		<div class="row">
			<div class="col-md-5 col-lg-4">
				<div v-if="inst" class="card mb-5 shadow-sm">
					<h6 class="card-header">Intézmény</h6>
					<div class="card-body">
						<p class="font-weight-bold">{{ inst.name }}</p>
						<span class="btn btn-link" @click="rename(inst)">Átnevezés</span>
					</div>
				</div>
				<div class="card mb-5 shadow-sm">
					<h6 class="align-items-center card-header d-flex">
						<span class="flex-grow-1">Intézmények</span>
						<span
							class="btn btn-link py-0 text-success"
							@click="add"
						>Hozzáadás</span>
					</h6>
					<div class="list-group list-group-flush">
						<div
							v-for="i in insts"
							:key="i.id"
							class="align-items-center d-flex list-group-item"
						>
							<b-form-radio
								v-model="inst"
								class="flex-grow-1"
								name="inst"
								:value="i"
							>
								{{ i.name }}
							</b-form-radio>
							<span
								class="btn btn-link text-danger"
								@click="remove(i)"
							>Törlés</span>
						</div>
					</div>
				</div>
			</div>
			<div class="col">
				<!-- Partimapok -->
			</div>
		</div>
	</div>
</template>

<script>
export default {
	async asyncData({ $axios }) {
		const insts = await $axios.$get('/api/inst/');
		return { insts };
	},
	data() {
		return {
			inst: null, // TODO load inst if logged in as member
			insts: [],
			title: 'Intézmények',
		};
	},
	head: {
		title: 'Admin',
	},
	methods: {
		async add() {
			const newName = prompt('Új név');
			if (newName) {
				const inst = { name: newName };
				await this.$axios.$put('/api/inst', inst);
				const insts = await this.$axios.$get('/api/inst/');
				this.insts = insts;
			}
		},
		async remove(inst) {
			if (confirm('Biztos?')) {
				const insts = await this.$axios.$delete('/api/inst/' + inst.id);
				this.insts = insts;
			}
		},
		async rename(inst) {
			const newName = prompt('Új név', inst.name);
			if (newName) {
				inst.name = newName;
				await this.$axios.$patch('/api/inst', inst);
				const insts = await this.$axios.$get('/api/inst/');
				this.insts = insts;
			}
		},
	},
};
</script>
