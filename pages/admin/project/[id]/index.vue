<script setup lang="ts">
import copy from 'copy-to-clipboard';
import slugify from 'slugify';
import type { Project } from '~/server/data/projects';

const route = useRoute();
const { id } = route.params;
const { data: project, refresh } = await useFetch<Project>(`/api/project/${id}`);
const { data: featureCounts } = await useFetch<Record<number, number>>(
	`/api/project/${id}/feature-counts`,
);

useHead({
	title: () => `Admin: ${project.value?.title}`,
});

const { errorToast, successToast } = useToasts();

const image = ref<any>(null);
const imageState = ref<boolean | null>(null);

watch(image, (val) => {
	// TODO same as in user editor -> move to component
	if (!val) {
		// clear validation error message on file removal
		imageState.value = null;
	} else {
		imageState.value = val.size < 5 * 1024 * 1024;
	}
});

function removeImage() {
	image.value = null;
	if (project.value) project.value.image = null;
}

async function uploadImage() {
	if (!imageState.value || !project.value) return;

	const formData = new FormData();
	formData.append('image', image.value);
	try {
		const { url } = await $fetch<{ url: string }>(`/api/project/${project.value.id}/image`, {
			method: 'PUT',
			body: formData,
		});
		project.value.image = url;
		image.value = null;
	} catch (error) {
		errorToast(t('imageUpload.failed'));
	}
}

const newPassword = ref('');
const passwordModified = ref(false);

function resetPassword() {
	if (project.value) project.value.password = '';
	newPassword.value = '';
	passwordModified.value = true;
}

const { locale, t } = useI18n();

const subscribeOptions = [
	{ value: 'N', text: t('projectEditor.subscribeN') },
	{ value: 'E', text: t('projectEditor.subscribeE') },
	{ value: 'D', text: t('projectEditor.subscribeD') },
];

const isPrivacyPolicyValid = computed(() => {
	const len = (project.value?.privacyPolicy || '').replace(/(<[^>]*>|\s+)/g, '').length;
	return len > 10;
});

const localePath = useLocalePath();
const projectPath = computed(() =>
	localePath('/p/' + (project.value?.slug || project.value?.id) + '/0'),
);

const {
	public: { baseUrl },
} = useRuntimeConfig();
const fullProjectPath = computed(() => baseUrl + projectPath.value);
const projectBaseURL = computed(() => `${baseUrl}/${locale.value}/p/`);

function generateSlug() {
	return slugify(project.value?.title || '');
}

function copyURL() {
	copy(fullProjectPath.value);
	successToast(t('projectEditor.copiedURL'));
}

async function update() {
	try {
		if (image.value) await uploadImage();

		const p: Record<string, any> = { ...project.value };
		if (!passwordModified.value) {
			delete p.password;
		} else {
			p.newPassword = newPassword.value;
		}
		await $fetch(`/api/project/${project.value?.id}`, { method: 'PATCH', body: p });
		await refresh();
		newPassword.value = '';
		passwordModified.value = false;
		successToast(t('projectEditor.changeSuccessful'));
	} catch (error) {
		errorToast(t('projectEditor.changeFailed'));
	}
}

const { confirmDeletion } = useConfirmation();
async function deleteProject() {
	const confirmed = await confirmDeletion(project.value!.title);
	if (!confirmed) return;
	try {
		await $fetch(`/api/project/${project.value?.id}`, { method: 'DELETE' });
		navigateTo(localePath('/admin/projects'));
	} catch (error) {
		errorToast(t('projects.deletionFailed'));
	}
}

// TODO FIXME
/*
import { orderBy } from 'lodash';

export default {
	methods: {
		addedSheet(sheet) {
			this.project.sheets.push(sheet);
		},
		async delSheet(sheet) {
			try {
				await this.$axios.$delete('/api/sheet/' + sheet.id);
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
			} catch (error) {
				this.errorToast(this.$t('projectEditor.sheetDeletionFailed'));
			}
		},
		async moveSheet(dir, sheet) {
			let otherSheet; // with which the current element is switched
			if (dir === 'down') {
				this.project.sheets.forEach((element) => {
					if (element.ord === sheet.ord + 1) {
						otherSheet = element;
					}
				});
				otherSheet.ord--;
				sheet.ord++;
				this.project.sheets = orderBy(this.project.sheets, 'ord', 'asc');
			} else if (dir === 'up') {
				this.project.sheets.forEach((element) => {
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
				this.errorToast(this.$t('projectEditor.sheetMovingFailed'));
			}
		},
	},
};*/
</script>

<template>
	<div v-if="project">
		<AdminFrame>
			<template #header>
				<div class="d-flex flex-wrap">
					<div>
						<NuxtLink :to="localePath('/admin/projects')">{{
							$t('projectEditor.back')
						}}</NuxtLink>
						<span class="text-muted">&raquo;</span>
						{{ project.title }}
					</div>
					<button
						:to="projectPath"
						class="btn btn-primary ms-auto"
						target="_blank"
						type="button"
					>
						{{ $t('projectEditor.view') }}
					</button>
				</div>
			</template>
			<form
				id="projectForm"
				@submit.prevent="update"
			>
				<form-group :label="$t('projectEditor.projectTitle')">
					<input
						v-model="project.title"
						class="form-control"
						required
					/>
				</form-group>
				<form-group
					:label="$t('projectEditor.slug')"
					:description="$t('projectEditor.slugDescription')"
				>
					<p class="d-md-none fw-bold mb-1 small text-muted">
						{{ projectBaseURL }}
					</p>
					<div class="flex-nowrap input-group">
						<button
							class="btn btn-primary"
							type="button"
							@click="copyURL"
						>
							<i class="fas fa-copy fa-fw" />
						</button>
						<span class="input-group-text">{{ projectBaseURL }}</span>
						<input
							v-model="project.slug"
							class="form-control"
							:placeholder="generateSlug()"
						/>
						<button
							v-b-tooltip.hover
							class="btn btn-secondary"
							:title="$t('projectEditor.generateSlug')"
							type="button"
							@click="project.slug = generateSlug()"
						>
							<i class="fas fa-magic fa-fw" />
						</button>
					</div>
				</form-group>
				<form-group
					:label="$t('projectEditor.password')"
					:description="$t('projectEditor.passwordDescription')"
				>
					<div class="flex-nowrap input-group">
						<button
							v-if="project.password"
							class="btn btn-danger"
							type="button"
							@click="resetPassword"
						>
							<i class="fas fa-backspace" />
						</button>
						<input
							v-model="newPassword"
							class="form-control"
							:placeholder="
								project.password
									? $t('projectEditor.passwordSet')
									: $t('projectEditor.newPassword')
							"
							:readonly="!!project.password"
							type="password"
							@change="passwordModified = true"
						/>
					</div>
				</form-group>
				<form-group
					:label="$t('projectEditor.projectDescription')"
					:description="(project.description || '').length + '/200'"
				>
					<textarea
						v-model="project.description"
						class="form-control"
						maxlength="200"
					/>
				</form-group>
				<form-group
					:invalid-feedback="$t('imageUpload.maxFileSize')"
					:label="$t('projectEditor.thumbnail')"
					:state="imageState"
				>
					<div
						v-if="!project.image"
						class="input-group"
					>
						<client-only>
							<b-form-file
								v-model="image"
								accept="image/jpeg, image/png, image/webp"
								class="project-image-input"
								browse-text=""
								:drop-placeholder="$t('imageUpload.dropzone')"
								:placeholder="$t('imageUpload.browse')"
								:state="imageState"
							/>
						</client-only>
						<button
							class="btn btn-outline-danger"
							:disabled="!image"
							type="button"
							@click="removeImage"
						>
							<i class="fas fa-backspace" />
						</button>
					</div>
					<div v-else>
						<figure class="figure">
							<img
								:src="project.image"
								:alt="$t('projectEditor.altThumbnail')"
								class="figure-img rounded"
								height="120"
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
				</form-group>
				<form-group
					class="rich"
					:label="$t('projectEditor.privacyPolicy')"
					:description="$t('projectEditor.privacyPolicyDescription')"
					:invalid-feedback="$t('projectEditor.privacyPolicyRequired')"
					:state="isPrivacyPolicyValid"
				>
					<client-only>
						<tiptap v-model="project.privacyPolicy" />
					</client-only>
				</form-group>
				<form-group
					class="rich"
					:label="$t('projectEditor.thanks')"
					:description="$t('projectEditor.thanksDescription')"
				>
					<client-only>
						<tiptap v-model="project.thanks" />
					</client-only>
				</form-group>
				<form-group
					:label="$t('projectEditor.thanksUrl')"
					:description="$t('projectEditor.thanksUrlDescription')"
				>
					<input
						v-model="project.thanksUrl"
						class="form-control"
					/>
				</form-group>
				<form-group>
					<client-only>
						<b-form-checkbox
							v-model="project.thanksSocial"
							value="1"
						>
							{{ $t('projectEditor.thanksSocial') }}
						</b-form-checkbox>
					</client-only>
				</form-group>
				<form-group
					:label="$t('projectEditor.subscribe')"
					:description="$t('projectEditor.subscribeDescription')"
				>
					<client-only>
						<b-form-radio-group
							id="radio-group-1"
							v-model="project.subscribe"
							:options="subscribeOptions"
							stacked
						/>
					</client-only>
				</form-group>
			</form>
			<template #footer>
				<div class="d-flex justify-content-between">
					<button
						class="btn btn-outline-danger"
						type="button"
						@click="deleteProject"
					>
						{{ $t('ListItem.delete') }}
					</button>
					<button
						class="btn btn-success"
						:disabled="!isPrivacyPolicyValid"
						form="projectForm"
						type="submit"
					>
						{{ $t('projectEditor.save') }}
					</button>
				</div>
			</template>
		</AdminFrame>
		<!-- <ProjectSheetManager
			:project="project"
			:project-id="project.id"
			:sheets="project.sheets"
			@added-sheet="addedSheet"
			@del-sheet="delSheet"
			@move-sheet="moveSheet"
		/> -->
	</div>
</template>
