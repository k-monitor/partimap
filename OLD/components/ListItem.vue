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
				v-if="userId != $auth.user.id"
				class="badge badge-warning"
			>
				{{ $t('ListItem.owner') }}: #{{ userId }}
			</span>
			<span
				v-else-if="$auth.user.isAdmin"
				class="badge badge-info"
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
				variant="danger"
				@click.prevent="$emit('del')"
			>
				<i class="fas fa-trash fa-fw me-1" />
				{{ $t('ListItem.delete') }}
			</b-dropdown-item>
		</b-dropdown>
	</div>
</template>

<script>
export default {
	props: {
		link: {
			type: String,
			default: null,
		},
		title: {
			type: String,
			default: null,
		},
		userId: {
			type: Number,
			default: null,
		},
	},
};
</script>
