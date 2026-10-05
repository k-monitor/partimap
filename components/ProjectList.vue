<script setup lang="ts">
import fileSaver from 'file-saver';
import type { Project } from '~/server/data/projects';

const { saveAs } = fileSaver;

const props = defineProps<{
	userId?: number;
	filter?: string;
	filterOwn?: boolean;
	lang?: string;
	showExportOption?: boolean;
}>();

const { locale, t } = useI18n();
const { errorToast } = useToasts();
const route = useRoute();
const router = useRouter();

const page = ref(1);
watch(
	() => [props.filter, props.filterOwn, props.lang],
	() => {
		page.value = 1;
	},
);

const { data, pending, refresh } = useFetch<{
	projects: Project[];
	total: number;
	pageSize: number;
}>('/api/project/all', {
	query: {
		userId: toRef(props, 'userId'),
		filter: toRef(props, 'filter'),
		filterOwn: toRef(props, 'filterOwn'),
		lang: toRef(props, 'lang'),
		page,
	},
});
const projects = computed(() => data.value?.projects ?? []);
const total = computed(() => data.value?.total ?? 0);
const pageSize = computed(() => data.value?.pageSize ?? 1);
const pageCount = computed(() => Math.ceil(total.value / pageSize.value));

const { loading, loadingText } = useStore();

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
		await downloadReport(Number(pid));
		router.replace({ path: route.path });
	}
});

async function clone(project: Project) {
	try {
		loading.value = true;
		await $fetch('/api/project/clone', {
			method: 'PUT',
			body: { id: project.id, title: `${project.title} ${new Date().toLocaleString()}` },
		});
		await refresh();
	} catch {
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
	} catch {
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

defineExpose({ refresh });

async function downloadDefinition(project: Project) {
	const object = await $fetch(`/api/project/${project.id}/export`);
	const json = JSON.stringify(object, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	saveAs(blob, `${project.slug}.json`);
}
</script>

<template>
	<div class="position-relative">
		<div class="list-group">
			<ProjectListItem
				v-for="p in projects"
				:key="p.id"
				:project="p"
				:show-export-option="showExportOption"
				show-transfer-option
				@clone="clone(p)"
				@del="del(p)"
				@download="downloadDefinition(p)"
				@transfer="initiateTransfer(p)"
				@report="downloadReport(p.id)"
			/>
		</div>
		<nav
			v-if="pageCount > 1"
			class="mt-3"
		>
			<ul class="pagination justify-content-center">
				<li
					class="page-item"
					:class="{ disabled: page <= 1 }"
				>
					<button
						class="page-link"
						@click="page--"
					>
						&laquo;
					</button>
				</li>
				<li
					v-for="p in pageCount"
					:key="p"
					class="page-item"
					:class="{ active: p === page }"
				>
					<button
						class="page-link"
						@click="page = p"
					>
						{{ p }}
					</button>
				</li>
				<li
					class="page-item"
					:class="{ disabled: page >= pageCount }"
				>
					<button
						class="page-link"
						@click="page++"
					>
						&raquo;
					</button>
				</li>
			</ul>
		</nav>
		<LoadingOverlay
			:show="loading || pending"
			:text="loadingText"
		/>
		<ProjectTransferModal
			v-model="transferModalVisible"
			:project="projectToTransfer"
			@transferred="handleTransferred"
		/>
	</div>
</template>
