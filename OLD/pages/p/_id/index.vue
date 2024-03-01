<script>
export default {
	middleware({ redirect, params }) {
		return redirect(`/p/${params.id}/0`);
	},
};
</script>
