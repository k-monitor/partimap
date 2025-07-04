<script setup lang="ts">
defineProps<{
	lang?: string;
	link: string;
	showExportOption?: boolean;
	showTransferOption?: boolean;
	title: string;
	userId: number;
}>();

defineEmits<{
	(e: 'clone'): void;
	(e: 'del'): void;
	(e: 'download'): void;
	(e: 'transfer'): void;
}>();

const { user } = useAuth();

const { locales } = useI18n();
function resolveLocaleName(code: string) {
	return locales.value.find((l) => l.code === code)?.name;
}
</script>

<template>
	<div class="align-items-center d-flex list-group-item px-2">
		<div>
			<NuxtLink
				:to="link"
				class="fw-bold me-2"
			>
				{{ title }}
			</NuxtLink>
			<span
				v-if="lang"
				class="badge text-bg-light me-2"
			>
				{{ resolveLocaleName(lang) }}
			</span>
			<span
				v-if="userId != user?.id"
				class="badge text-bg-warning"
			>
				{{ $t('ListItem.owner') }}: #{{ userId }}
			</span>
			<span
				v-else-if="user?.isAdmin"
				class="badge text-bg-info"
			>
				{{ $t('ListItem.own') }}
			</span>
			<slot />
		</div>
		<b-dropdown
			class="ms-auto"
			dropleft
			no-caret
			variant="link"
		>
			<template #button-content>
				<i class="fas fa-ellipsis-v text-secondary"></i>
			</template>
			<b-dropdown-item
				variant="dark"
				@click.prevent="$emit('clone')"
			>
				<i class="fas fa-clone fa-fw me-1" />
				{{ $t('ListItem.clone') }}
			</b-dropdown-item>
			<b-dropdown-item
				v-if="showTransferOption"
				variant="dark"
				@click.prevent="$emit('transfer')"
			>
				<i class="fas fa-user fa-fw me-1" />
				{{ $t('ListItem.transfer') }}
			</b-dropdown-item>
			<b-dropdown-item
				v-if="!!showExportOption"
				variant="dark"
				@click.prevent="$emit('download')"
			>
				<i class="fas fa-code fa-fw me-1" />
				{{ $t('ListItem.downloadDefinition') }}
			</b-dropdown-item>
			<b-dropdown-item
				variant="danger"
				@click.prevent="$emit('del')"
			>
				<i class="fas fa-trash fa-fw me-1" />
				{{ $t('ListItem.delete') }}
			</b-dropdown-item>
		</b-dropdown>
	</div>
</template>
