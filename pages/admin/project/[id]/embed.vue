<script setup lang="ts">
import copy from 'copy-to-clipboard';
import type { Project } from '~/server/data/projects';

const localePath = useLocalePath();

const route = useRoute();
const { id } = route.params;
const { data: project } = await useFetch<Project>(`/api/project/${id}`);

const width = ref(500);
const height = ref(500);

const projectPath = computed(
	() => `/${project.value?.lang}/p/${project.value?.slug || project.value?.id}/0`,
);

const {
	public: { baseUrl },
} = useRuntimeConfig();
const fullProjectPath = computed(() => baseUrl + projectPath.value);

const iframeHtml = computed(() => {
	return `
		<iframe
			src="${fullProjectPath.value}"
			width="${width.value}"
			height="${height.value}"
			frameborder="0"
			allowfullscreen
		></iframe>`
		.replace(/\s+/g, ' ')
		.trim();
});

const { t } = useI18n();
const { successToast } = useToasts();

function copyCode() {
	copy(iframeHtml.value);
	successToast(t('projectEditor.embedCodeCopied'));
}
</script>

<template>
	<!-- eslint-disable vue/no-v-html -->
	<div v-if="project">
		<AdminFrame>
			<template #header>
				<div class="d-flex flex-wrap align-items-center">
					<div>
						<NuxtLink :to="localePath('/admin/projects')">
							{{ t('projectEditor.back') }}
						</NuxtLink>
						<span class="text-muted mx-2">&raquo;</span>
						<span>{{ project.title }}</span>
					</div>
					<div class="ms-auto mt-3 mt-md-0">
						<NuxtLink
							class="btn btn-primary m-2"
							:to="localePath(`/admin/project/${project.id}`)"
							role="button"
						>
							{{ t('Sidebar.back') }}
						</NuxtLink>
					</div>
				</div>
			</template>
			<div class="row">
				<div class="col-12 col-md-6 col-lg-6">
					<div class="row">
						<div class="col-12 col-sm-6 col-md-12 col-lg-6">
							<b-form-group
								class="mb-3"
								:label="t('projectEditor.embedWidth')"
							>
								<b-input-group append="px">
									<b-form-input
										v-model="width"
										type="number"
										min="300"
										max="2000"
										step="10"
									/>
								</b-input-group>
							</b-form-group>
						</div>
						<div class="col">
							<b-form-group
								class="mb-3"
								:label="t('projectEditor.embedHeight')"
							>
								<b-input-group append="px">
									<b-form-input
										v-model="height"
										type="number"
										min="300"
										max="2000"
										step="10"
									/>
								</b-input-group>
							</b-form-group>
						</div>
					</div>
				</div>
				<div class="col">
					<p
						class="font-monospace small bg-light ps-2 pe-5 py-2 rounded border position-relative h-100"
					>
						<button
							class="btn btn-outline-primary btn-sm position-absolute"
							style="right: 6px; top: 4px"
							type="button"
							@click="copyCode"
						>
							<i class="fas fa-copy fa-fw" />
						</button>
						{{ iframeHtml }}
					</p>
				</div>
			</div>
		</AdminFrame>

		<div class="container-fluid d-flex mb-5">
			<div class="mx-auto border shadow-sm">
				<iframe
					:src="projectPath"
					:width="width"
					:height="height"
					frameborder="0"
					allowfullscreen
				></iframe>
			</div>
		</div>
	</div>
</template>
