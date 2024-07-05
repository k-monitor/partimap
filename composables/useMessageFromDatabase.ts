export default async function useMessageFromDatabase(key: string) {
	const { locale } = useI18n();
	const { data } = await useFetch<{ value: string }>(`/api/message/${locale.value}/${key}`, {
		deep: false,
		watch: [locale],
	});
	const message = computed(() => data.value?.value);
	return message;
}
