<script setup lang="ts">
import { computed } from 'vue';

const localePath = useLocalePath();
const route = useRoute();

const { data: response } = await useFetch<{ success: boolean }>('/api/project/unsubscribe', {
	method: 'POST',
	body: route.query,
});

const successful = computed(() => response.value?.success);
</script>

<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<div class="card shadow-sm">
					<CardHeader :text="$t('unsubscribe.title')" />
					<div class="card-body">
						<div
							v-if="successful"
							class="alert alert-success"
						>
							{{ $t('unsubscribe.success') }}
						</div>
						<div
							v-else
							class="alert alert-danger"
						>
							{{ $t('unsubscribe.failed') }}
						</div>
					</div>
					<div class="card-footer d-flex justify-content-end">
						<b-button
							:to="localePath('/')"
							variant="primary"
						>
							{{ $t('unsubscribe.home') }}
						</b-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
