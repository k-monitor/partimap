<template>
	<AdminFrame>
		<template #header>
			<span v-if="$auth.user.isAdmin">
				<NuxtLink :to="localePath('/admin/users')">{{
					$t('userEditor.back')
				}}</NuxtLink>
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
			<b-form-group :label="$t('userEditor.name')">
				<b-form-input
					v-model="m.name"
					required
				/>
			</b-form-group>
			<b-form-group
				:invalid-feedback="$t('imageUpload.maxFileSize')"
				:label="$t('userEditor.logo')"
				:description="$t('userEditor.logoDescription')"
				:state="imageState"
			>
				<b-input-group v-if="!m.logo">
					<b-form-file
						v-model="image"
						accept="image/jpeg, image/png, image/webp"
						class="project-image-input"
						browse-text=""
						:drop-placeholder="$t('imageUpload.dropzone')"
						:placeholder="$t('imageUpload.browse')"
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
							:alt="$t('userEditor.altLogo')"
							class="figure-img rounded"
							height="30"
						/>
						<figcaption class="figure-caption">
							<a
								class="text-danger"
								href="javascript:void(0)"
								@click="removeImage"
								>{{ $t('imageUpload.remove') }}</a
							>
						</figcaption>
					</figure>
				</div>
			</b-form-group>
			<b-form-group
				:label="$t('userEditor.color')"
				:description="$t('userEditor.colorDescription')"
			>
				<b-button
					v-if="!m.color"
					variant="outline-primary"
					@click="m.color = '#000000'"
				>
					{{ $t('userEditor.colorAdd') }}
				</b-button>
				<div v-else>
					<div class="d-flex align-items-center">
						<b-form-input
							v-model="m.color"
							style="width: 100px; min-width: 100px"
							type="color"
						/>
						<span
							v-if="isTooBright"
							class="font-weight-bold text-danger ml-3"
							>{{ $t('userEditor.colorTooBright') }}</span
						>
					</div>
					<a
						class="small text-danger"
						href="javascript:void(0)"
						@click="m.color = null"
						>{{ $t('userEditor.colorDel') }}</a
					>
				</div>
			</b-form-group>
			<b-form-group
				:label="$t('userEditor.website')"
				:description="$t('userEditor.websiteDescription')"
			>
				<b-form-input v-model="m.website" />
			</b-form-group>
			<b-form-group :label="$t('userEditor.newPassword')">
				<b-form-input
					v-model="m.newPassword"
					type="password"
				/>
			</b-form-group>
			<b-form-group
				v-if="!$auth.user.isAdmin"
				:label="$t('userEditor.oldPassword')"
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
						{{ $t('userEditor.activated') }}
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
						{{ $t('userEditor.administrator') }}
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
					{{ $t('userEditor.deleteUser') }}
				</b-button>
				<b-button
					form="userForm"
					type="submit"
					variant="primary"
				>
					{{ $t('userEditor.save') }}
				</b-button>
			</div>
		</template>

		<b-modal
			id="delete-user-modal"
			:busy="loading"
			:cancel-title="$t('userEditor.cancel')"
			cancel-variant="success"
			centered
			footer-class="d-flex justify-content-between"
			hide-header
			no-close-on-backdrop
			no-close-on-esc
			no-enforce-focus
			:ok-disabled="!delConfirm || !delPassword"
			:ok-title="$t('userEditor.confirmDeleteUser')"
			ok-variant="danger"
			@ok="deleteAccount"
			@shown="$refs.delPassword.focus()"
		>
			<b-form-group :label="$t('userEditor.enterPassword')">
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
					<!-- eslint-disable-next-line vue/no-v-html -->
					<span
						v-html="
							$t('userEditor.deleteConfirmation', {
								email: u.email,
							})
						"
					/>
				</b-form-checkbox>
			</b-alert>
		</b-modal>
	</AdminFrame>
</template>

<script>
import tinycolor from 'tinycolor2';

export default {
	middleware: ['auth'],
	async asyncData({ $axios, params, redirect }) {
		try {
			const u = await $axios.$get('/api/user/' + params.id);
			return {
				u,
				m: { ...u, newPassword: null, oldPassword: null },
			};
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
	computed: {
		isTooBright() {
			if (!this.m.color) return false;
			const cr =
				(0.05 + tinycolor('white').getLuminance()) /
				(0.05 + tinycolor(this.m.color).getLuminance());
			return cr < 4.5; // WCAG AA
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
					this.$router.push(this.localePath('/admin/users'));
				}
			} catch {
				this.errorToast(this.$t('userEditor.deletionFailed'));
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
				this.success(this.$t('userEditor.changeSuccessful'));
			} catch (error) {
				this.errorToast(this.$t('userEditor.changeFailed'));
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
				this.errorToast(this.$t('imageUpload.failed'));
			}
		},
	},
};
</script>
