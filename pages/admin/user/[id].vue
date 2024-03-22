<script setup lang="ts">
import tinycolor from 'tinycolor2';
import type { User } from '~/server/data/users';

const { user, updateSession } = useAuth();
const { t } = useI18n();
const localePath = useLocalePath();
const { errorToast, successToast } = useToasts();

const route = useRoute();
const { data: u, refresh } = await useFetch<User>('/api/user/' + route.params.id);

useHead({
	title: () => 'Admin: ' + (u.value?.name || u.value?.email),
});

const m = ref({
	...u.value,
	newPassword: '',
	oldPassword: '',
});

const isTooBright = computed(() => {
	if (!m.value.color) return false;
	const cr =
		(0.05 + tinycolor('white').getLuminance()) /
		(0.05 + tinycolor(m.value.color).getLuminance());
	return cr < 4.5; // WCAG AA
});

const image = ref<any>(null);
const imageState = ref<boolean | null>(null);
watch(image, (val) => {
	if (!val) {
		// clear validation error message on file removal
		imageState.value = null;
	} else {
		imageState.value = val.size < 5 * 1024 * 1024;
	}
});

function removeImage() {
	image.value = null;
	m.value.logo = null;
}

async function uploadImage() {
	if (!imageState.value) return;

	const formData = new FormData();
	formData.append('image', image.value);
	try {
		const { url } = await $fetch<{ url: string }>(`/api/user/${u.value?.id}/logo`, {
			method: 'PUT',
			body: formData,
		});
		m.value.logo = url;
		image.value = null;
	} catch (error) {
		errorToast(t('imageUpload.failed'));
	}
}

async function update() {
	try {
		if (image.value) {
			await uploadImage();
		}
		const user = await $fetch<User>(`/api/user/${u.value?.id}`, {
			method: 'PATCH',
			body: m.value,
		});
		m.value = { ...user, newPassword: '', oldPassword: '' };
		await refresh(); // need to update page title
		await updateSession();
		successToast(t('userEditor.changeSuccessful'));
	} catch (error) {
		errorToast(t('userEditor.changeFailed'));
	}
}

const delModal = ref(false);
const delConfirm = ref(false);
const delPassword = ref('');
const delPasswordInput = ref<HTMLInputElement>();
const loading = ref(false);
async function deleteAccount(e: any) {
	e.preventDefault(); // do not close modal automatically, user must wait
	loading.value = true;
	try {
		await $fetch('/api/user/delete', {
			method: 'POST',
			body: {
				id: u.value?.id,
				password: delPassword.value,
			},
		});
		if (u.value?.id === user.value?.id) {
			authLogout();
		} else {
			navigateTo(localePath('/admin/users'));
		}
	} catch {
		errorToast(t('userEditor.deletionFailed'));
	} finally {
		delConfirm.value = false;
		delPassword.value = '';
		loading.value = false;
		delModal.value = false;
	}
}
</script>

<template>
	<!-- eslint-disable vue/no-v-html -->
	<AdminFrame>
		<template #header>
			<span v-if="user?.isAdmin">
				<NuxtLink :to="localePath('/admin/users')">{{ $t('userEditor.back') }}</NuxtLink>
				<span class="ms-2 text-muted">&raquo;</span>
			</span>
			{{ u?.email }}
		</template>

		<form
			id="userForm"
			@submit.prevent="update"
		>
			<form-group label="Email">
				<input
					v-model="m.email"
					class="form-control"
					required
					type="email"
				/>
			</form-group>

			<form-group :label="$t('userEditor.name')">
				<input
					v-model="m.name"
					class="form-control"
					required
				/>
			</form-group>

			<client-only>
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
			</client-only>

			<form-group
				:label="$t('userEditor.color')"
				:description="$t('userEditor.colorDescription')"
			>
				<div v-if="!m.color">
					<button
						class="btn btn-outline-primary"
						type="button"
						@click="m.color = '#000000'"
					>
						{{ $t('userEditor.colorAdd') }}
					</button>
				</div>
				<div v-else>
					<div class="d-flex align-items-center">
						<input
							v-model="m.color"
							class="form-control"
							style="height: 2.5rem; width: 100px; min-width: 100px"
							type="color"
						/>
						<span
							v-if="isTooBright"
							class="fw-bold text-danger ms-3"
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
			</form-group>

			<form-group
				:label="$t('userEditor.website')"
				:description="$t('userEditor.websiteDescription')"
			>
				<input
					v-model="m.website"
					class="form-control"
				/>
			</form-group>

			<form-group :label="$t('userEditor.newPassword')">
				<input
					v-model="m.newPassword"
					class="form-control"
					type="password"
				/>
			</form-group>

			<form-group
				v-if="!user?.isAdmin"
				:label="$t('userEditor.oldPassword')"
			>
				<input
					v-model="m.oldPassword"
					class="form-control"
					:required="!!m.newPassword || m.email !== u?.email"
					type="password"
				/>
			</form-group>

			<client-only v-if="user?.isAdmin">
				<form-group>
					<b-form-checkbox
						v-model="m.active"
						class="text-danger"
						:disabled="m.id === user?.id"
						:value="1"
						:unchecked-value="0"
					>
						{{ $t('userEditor.activated') }}
					</b-form-checkbox>
				</form-group>
				<form-group>
					<b-form-checkbox
						v-model="m.isAdmin"
						class="text-danger"
						:disabled="m.id === user?.id"
						:value="1"
						:unchecked-value="0"
					>
						{{ $t('userEditor.administrator') }}
					</b-form-checkbox>
				</form-group>
			</client-only>
		</form>

		<template #footer>
			<div class="d-flex justify-content-between">
				<button
					class="btn btn-outline-danger"
					type="button"
					@click="delModal = true"
				>
					{{ $t('userEditor.deleteUser') }}
				</button>
				<button
					class="btn btn-primary"
					form="userForm"
					type="submit"
				>
					{{ $t('userEditor.save') }}
				</button>
			</div>
		</template>

		<client-only>
			<b-modal
				v-model="delModal"
				:busy="loading"
				:cancel-title="$t('modals.cancel')"
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
				@shown="delPasswordInput?.focus()"
			>
				<form-group :label="$t('userEditor.enterPassword')">
					<input
						ref="delPasswordInput"
						v-model="delPassword"
						class="form-control"
						:disabled="loading"
						type="password"
						@update="delConfirm = false"
					/>
				</form-group>
				<div class="alert alert-danger">
					<b-form-checkbox
						v-model="delConfirm"
						:disabled="loading || !delPassword"
						name="confirm"
					>
						<span
							v-html="
								$t('userEditor.deleteConfirmation', {
									email: u?.email,
								})
							"
						/>
					</b-form-checkbox>
				</div>
			</b-modal>
		</client-only>
	</AdminFrame>
</template>
