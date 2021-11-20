<template>
	<AdminFrame>
		<template #header>
			<span v-if="$auth.user.isAdmin">
				<NuxtLink to="/admin/users">Felhasználók</NuxtLink>
				<span class="text-muted">&raquo;</span>
			</span>
			{{ u.email }}
		</template>

		<form
			id="userForm"
			@submit.prevent="update"
		>
			<b-form-group label="Email">
				<b-form-input
					v-model="m.email"
					required
					type="email"
				/>
			</b-form-group>
			<b-form-group label="Név">
				<b-form-input
					v-model="m.name"
					required
				/>
			</b-form-group>
			<b-form-group
				invalid-feedback="Maximális fájlméret: 5 MB"
				label="Logó (ajánlott méret: 120x30 pixel)"
				description="Ez a logó minden projektedben meg fog jelenni."
				:state="imageState"
			>
				<b-input-group v-if="!m.logo">
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
							:src="m.logo"
							alt="Logó"
							class="figure-img rounded"
							height="30"
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
				label="Weboldal URL"
				description="Ha feltöltesz logót, ide fog linkelni."
			>
				<b-form-input v-model="m.website" />
			</b-form-group>
			<b-form-group label="Új jelszó">
				<b-form-input
					v-model="m.newPassword"
					type="password"
				/>
			</b-form-group>
			<b-form-group
				v-if="!$auth.user.isAdmin"
				label="Jelenlegi jelszó (csak email vagy jelszó változtatás esetén szükséges)"
			>
				<b-form-input
					v-model="m.oldPassword"
					:required="m.newPassword || m.email !== u.email"
					type="password"
				/>
			</b-form-group>
			<div v-if="$auth.user.isAdmin">
				<b-form-group>
					<b-form-checkbox
						v-model="m.active"
						class="text-danger"
						:disabled="m.id === $auth.user.id"
						:value="1"
						:unchecked-value="0"
					>
						Aktiválva
					</b-form-checkbox>
				</b-form-group>
				<b-form-group>
					<b-form-checkbox
						v-model="m.isAdmin"
						class="text-danger"
						:disabled="m.id === $auth.user.id"
						:value="1"
						:unchecked-value="0"
					>
						Adminisztrátor
					</b-form-checkbox>
				</b-form-group>
			</div>
		</form>

		<template #footer>
			<div class="d-flex justify-content-between">
				<b-button
					v-b-modal.delete-user-modal
					variant="outline-danger"
				>
					Fiók törlése
				</b-button>
				<b-button
					form="userForm"
					type="submit"
					variant="primary"
				>
					Mentés
				</b-button>
			</div>
		</template>

		<b-modal
			id="delete-user-modal"
			:busy="loading"
			cancel-title="Mégsem"
			cancel-variant="success"
			centered
			footer-class="d-flex justify-content-between"
			hide-header
			no-close-on-backdrop
			no-close-on-esc
			no-enforce-focus
			:ok-disabled="!delConfirm || !delPassword"
			ok-title="Fiók törlése"
			ok-variant="danger"
			@ok="deleteAccount"
			@shown="$refs.delPassword.focus()"
		>
			<b-form-group label="Kérlek add meg a jelszavad:">
				<b-form-input
					ref="delPassword"
					v-model="delPassword"
					:disabled="loading"
					type="password"
					@update="delConfirm = false"
				/>
			</b-form-group>
			<b-alert
				show
				variant="danger"
			>
				<b-form-checkbox
					v-model="delConfirm"
					:disabled="loading || !delPassword"
					name="confirm"
				>
					<strong>Jól meggondoltam,</strong><br>
					törlöm a <strong>{{ u.email }}</strong> fiókot és annak minden adatát (térképek, projektek, beérkezett adatok, képek).
				</b-form-checkbox>
			</b-alert>
		</b-modal>
	</AdminFrame>
</template>

<script>
export default {
	middleware: ['auth'],
	async asyncData({ $axios, params, redirect }) {
		try {
			const u = await $axios.$get('/api/user/' + params.id);
			return { u, m: { ...u, newPassword: null, oldPassword: null } };
		} catch (err) {
			redirect('/admin/users');
		}
	},
	data() {
		return {
			delConfirm: false,
			delPassword: '',
			image: null,
			imageState: null,
			loading: false,
		};
	},
	head() {
		return {
			title: 'Admin: ' + (this.u.name || this.u.email),
		};
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
		async deleteAccount(e) {
			e.preventDefault(); // do not close modal automatically, user must wait
			this.loading = true;
			try {
				await this.$axios.$post('/api/user/delete', {
					id: this.u.id,
					password: this.delPassword,
				});
				if (this.u.id === this.$auth.user.id) {
					this.$auth.logout('cookie');
				} else {
					this.$router.push('/admin/users');
				}
			} catch {
				this.errorToast('Törlés sikertelen');
			} finally {
				this.delConfirm = false;
				this.delPassword = '';
				this.loading = false;
				this.$nextTick(() => {
					this.$bvModal.hide('delete-user-modal');
				});
			}
		},
		removeImage() {
			this.image = null;
			this.m.logo = null;
		},
		async update() {
			try {
				if (this.image) {
					await this.uploadImage();
				}
				this.u = await this.$axios.$patch('/api/user', this.m);
				this.m = { ...this.u, newPassword: null, oldPassword: null };
				this.$auth.fetchUser();
				this.success('Módosítás sikeres');
			} catch (error) {
				this.errorToast('Módosítás sikertelen');
			}
		},
		async uploadImage() {
			if (!this.imageState) {
				return;
			}
			const formData = new FormData();
			formData.append('image', this.image);
			try {
				this.m = await this.$axios.$put(
					'/api/user/' + this.m.id + '/logo',
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
	},
};
</script>
