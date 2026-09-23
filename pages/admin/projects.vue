<script setup lang="ts">
import type { PublicUser } from '~/server/data/users';

const { user } = useAuth() as { user: Ref<PublicUser | null> };
const { locale, locales, t } = useI18n();
const localePath = useLocalePath();

useHead({
	title: `Admin: ${t('projects.title')}`,
});

const filter = ref('');
const debouncedFilter = refDebounced(filter, 150);
const filterOwn = ref(true);
const langFilter = ref(locale.value);
watch(locale, (l) => (langFilter.value = l));

const { errorToast } = useToasts();
const newProjectTitle = ref(null);

async function add() {
	try {
		const { id } = await $fetch<{ id: number }>('/api/project', {
			method: 'PUT',
			body: {
				lang: locale.value,
				title: newProjectTitle.value,
				privacyPolicy: `<p>${t('projects.userName')}: ${
					user.value?.fullName
				}</p><p>E-mail: <a href="mailto:${user.value?.email}">${user.value?.email}</a></p>`,
				thanks: `<h5>${t('projectEditor.thanksDefault')}</h5>`,
			},
		});
		navigateTo(localePath(`/admin/project/${id}`));
	} catch (error) {
		errorToast(t('projects.creationFailed'));
	}
}

const projectList = ref<{ refresh: () => void } | null>(null);

function uploadDefinition() {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = '.json';
	input.setAttribute('type', 'file');
	input.addEventListener('change', async (e: Event) => {
		const fileInputEl = e.target as HTMLInputElement;
		const file = fileInputEl.files?.[0];
		if (!file) return;
		const fileReader = new FileReader();
		fileReader.onload = async (e: Event) => {
			const json = (e.target as FileReader).result?.toString() || '';
			await $fetch('/api/project/import', {
				method: 'PUT',
				body: json,
			});
			projectList.value?.refresh();
		};
		fileReader.readAsText(file);
	});
	input.click();
}
</script>

<template>
	<AdminFrame>
		<template #header>
			{{ t('projects.title') }}
		</template>

		<div class="row">
			<div class="col-12 col-md-8 col-lg-5 d-flex">
				<form
					class="flex-grow-1"
					@submit.prevent="add"
				>
					<div class="input-group mb-3">
						<input
							v-model="newProjectTitle"
							class="form-control"
							:placeholder="t('projects.newProjectName')"
							required
							type="text"
						/>
						<button
							class="btn btn-outline-success"
							type="submit"
						>
							{{ t('projects.add') }}
						</button>
					</div>
				</form>
				<div
					v-if="user.isAdmin"
					class="ms-2"
				>
					<button
						v-b-tooltip.hover.bottom
						class="btn btn-outline-secondary"
						:title="t('projects.uploadDefinition')"
						type="button"
						@click="uploadDefinition"
					>
						<i class="fas fa-code fa-fw" />
					</button>
				</div>
			</div>
			<div class="col-6 col-md-4 col-lg-2">
				<div class="form-group mb-3 mx-auto">
					<input
						v-model="filter"
						class="form-control"
						:placeholder="t('projects.filter')"
						type="text"
					/>
				</div>
			</div>
			<div class="col-6 col-lg-2">
				<div class="form-group mb-3 mx-auto">
					<select
						v-model="langFilter"
						class="form-select"
					>
						<option
							key="_all"
							value=""
						>
							{{ t('projects.langFilter') }}
						</option>
						<option
							v-for="l in locales"
							:key="l.code"
							:value="l.code"
						>
							{{ l.name }}
						</option>
					</select>
				</div>
			</div>
			<div
				v-if="user?.isAdmin"
				class="col-6 col-lg-3 d-flex align-items-center mb-3"
			>
				<BFormCheckbox
					v-model="filterOwn"
					class="text-nowrap"
					switch
				>
					{{ t('projects.ownProjects') }}
				</BFormCheckbox>
			</div>
		</div>

		<ProjectList
			ref="projectList"
			:filter="debouncedFilter"
			:filter-own="filterOwn"
			:lang="langFilter"
			:show-export-option="!!user?.isAdmin"
		/>
	</AdminFrame>
</template>
