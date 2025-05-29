<script setup lang="ts">
import { saveAs } from 'file-saver';
import type { Project } from '~/server/data/projects';

const { user } = useAuth();
const { locale, locales, t } = useI18n();
const localePath = useLocalePath();

useHead({
	title: `Admin: ${t('projects.title')}`,
});

const { loading, loadingText } = useStore();

const { data: projects, refresh } = await useFetch<Project[]>('/api/project/all');

const filter = ref('');
const filterOwn = ref(false);
const langFilter = ref(locale.value);
watch(locale, (l) => (langFilter.value = l));

const filteredProjects = computed(() => {
	const needle = filter.value.toLowerCase();
	const result = (projects.value || []).filter((p) => {
		if (!!langFilter.value && p.lang !== langFilter.value) return false;
		if (filterOwn.value && user.value?.id !== p.userId) return false;
		const haystack = `${p.title}|${p.description || ''}`.toLowerCase();
		return haystack.includes(needle);
	});
	result.sort((a, b) => b.id - a.id); // newest first, using the fact that IDs are timestamps
	return result;
});

const route = useRoute();
const router = useRouter();

function reportUrl(id: number) {
	return `/api/project/${id}/report/${locale.value}`;
}

async function downloadReport(id: number) {
	loading.value = true;
	loadingText.value = t('projects.exporting');

	const res = await fetch(reportUrl(id));
	const blob = await res.blob();
	const filename = res.headers.get('Content-Disposition')!.split(';')[1].split('=')[1];
	saveAs(blob, filename);

	loading.value = false;
	loadingText.value = '';
}

onMounted(async () => {
	const pid = route.query.dlr;
	if (pid) {
		// start downloading project report
		await downloadReport(Number(pid));

		// remove query param
		router.replace({ path: route.path });
	}
});

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
					user.value?.name
				}</p><p>E-mail: <a href="mailto:${user.value?.email}">${user.value?.email}</a></p>`,
				thanks: `<h5>${t('projectEditor.thanksDefault')}</h5>`,
			},
		});
		navigateTo(localePath(`/admin/project/${id}`));
	} catch (error) {
		errorToast(t('projects.creationFailed'));
	}
}

async function clone(project: Project) {
	try {
		loading.value = true;
		await $fetch('/api/project/clone', {
			method: 'PUT',
			body: {
				id: project.id,
				title: `${project.title} ${new Date().toLocaleString()}`,
			},
		});
		await refresh();
	} catch (error) {
		errorToast(t('projects.creationFailed'));
	} finally {
		loading.value = false;
	}
}

const { confirmDeletion } = useConfirmation();
async function del(project: Project) {
	const confirmed = await confirmDeletion(project.title);
	if (!confirmed) return;
	try {
		loading.value = true;
		await $fetch(`/api/project/${project.id}`, { method: 'DELETE' });
		await refresh();
	} catch (error) {
		errorToast(t('projects.deletionFailed'));
	} finally {
		loading.value = false;
	}
}

const projectToTransfer = ref<Project | null>(null);
const transferModalVisible = ref(false);
function initiateTransfer(p: Project) {
	projectToTransfer.value = p;
	transferModalVisible.value = true;
}
function handleTransferred() {
	transferModalVisible.value = false;
	projectToTransfer.value = null;
	refresh();
}

async function downloadDefinition(project: Project) {
	const object = await $fetch(`/api/project/${project.id}/export`);
	const json = JSON.stringify(object, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	saveAs(blob, `${project.slug}.json`);
}

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
			refresh();
		};
		fileReader.readAsText(file);
	});
	input.click();
}
</script>

<template>
	<AdminFrame>
		<template #header>
			{{ $t('projects.title') }}
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
							:placeholder="$t('projects.newProjectName')"
							required
							type="text"
						/>
						<button
							class="btn btn-outline-success"
							type="submit"
						>
							{{ $t('projects.add') }}
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
						:title="$t('projects.uploadDefinition')"
						type="button"
						@click="uploadDefinition"
					>
						<i class="fas fa-code fa-fw"></i>
					</button>
				</div>
			</div>
			<div class="col-6 col-md-4 col-lg-3">
				<div class="form-group mb-3 mx-auto">
					<input
						v-model="filter"
						class="form-control"
						:placeholder="$t('projects.filter')"
						type="text"
					/>
				</div>
			</div>
			<div class="col-6 col-lg-2">
				<div class="form-group mb-3 mx-auto">
					<select
						v-model="langFilter"
						class="form-select"
						type="text"
					>
						<option
							key="_all"
							value=""
						>
							{{ $t('projects.langFilter') }}
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
				class="col-6 col-lg-2"
			>
				<input
					class="btn btn-outline-primary form-control mb-3"
					:class="{ active: filterOwn }"
					type="button"
					:value="$t('projects.ownProjects')"
					@click="filterOwn = !filterOwn"
				/>
			</div>
		</div>
		<div class="list-group">
			<ListItem
				v-for="p in filteredProjects"
				:key="p.id"
				:lang="p.lang"
				:link="localePath('/admin/project/' + p.id)"
				:show-export-option="user.isAdmin"
				show-transfer-option
				:title="p.title"
				:user-id="p.userId"
				@clone="clone(p)"
				@del="del(p)"
				@download="downloadDefinition(p)"
				@transfer="initiateTransfer(p)"
			>
				<br />
				{{ $t('projects.views') }}: {{ p.views }}, {{ $t('projects.submissions') }}:
				{{ p.submissions }}
				<a
					v-if="p.submissions"
					href="javascript:void(0)"
					@click="downloadReport(p.id)"
					>{{ $t('projects.export') }}</a
				>
			</ListItem>
		</div>
		<LoadingOverlay
			:show="loading"
			:text="loadingText"
		/>
		<ProjectTransferModal
			v-model="transferModalVisible"
			:project="projectToTransfer"
			@transferred="handleTransferred"
		/>
	</AdminFrame>
</template>
