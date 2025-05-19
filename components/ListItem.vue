<script setup lang="ts">
defineProps<{
	lang?: string;
	link: string;
	title: string;
	userId: number;
}>();

defineEmits<{
	(e: 'clone'): void;
	(e: 'del'): void;
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
		<client-only>
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
					variant="danger"
					@click.prevent="$emit('del')"
				>
					<i class="fas fa-trash fa-fw me-1" />
					{{ $t('ListItem.delete') }}
				</b-dropdown-item>
			</b-dropdown>
		</client-only>
	</div>
</template>
