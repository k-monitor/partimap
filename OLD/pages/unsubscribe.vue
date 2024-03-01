<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<div class="card shadow-sm">
					<CardHeader :text="$t('unsubscribe.title')" />
					<div class="card-body">
						<b-alert
							v-if="successful"
							show
							variant="success"
						>
							{{ $t('unsubscribe.success') }}
						</b-alert>
						<b-alert
							v-else
							show
							variant="danger"
						>
							{{ $t('unsubscribe.failed') }}
						</b-alert>
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

<script>
export default {
	async asyncData({ $axios, route }) {
		let successful = false;
		try {
			const { id, token } = route.query;
			const res = await $axios.$post(`/api/project/unsubscribe`, {
				id,
				token,
			});
			successful = res.success;
		} catch (error) {}
		return { successful };
	},
};
</script>
