<template>
	<div class="card-header p-0">
		<b-navbar>
			<b-navbar-nav>
				<b-navbar-text>
					<h5 class="m-0">{{ text }}</h5>
				</b-navbar-text>
			</b-navbar-nav>
			<b-navbar-nav class="ms-auto">
				<LangSwitcher />
			</b-navbar-nav>
		</b-navbar>
	</div>
</template>

<script>
export default {
	props: {
		text: {
			type: String,
			default: '',
		},
	},
};
</script>
