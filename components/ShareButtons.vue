<script setup lang="ts">
const social = [
	{ network: 'facebook', icon: 'fab fa-facebook-f'.split(' ') },
	{ network: 'twitter', icon: 'fab fa-twitter'.split(' ') },
	{ network: 'email', icon: 'fas fa-envelope'.split(' ') },
];

const projectUrl = ref<string | null>(null);
onMounted(() => (projectUrl.value = window.location.href.replace(/\/\d+\/?/, '')));
</script>

<template>
	<div class="d-flex justify-content-around">
		<SocialShare
			v-for="s in social"
			:key="s.network"
			class="btn btn-link"
			:label="false"
			:network="s.network"
			:styled="false"
			:url="projectUrl"
		>
			<template #icon>
				<i
					class="fa-fw fa-2x"
					:class="s.icon"
				/>
			</template>
		</SocialShare>
	</div>
</template>
