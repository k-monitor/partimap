export function useImageUpload() {
	const { t } = useI18n();
	const { errorToast } = useToasts();

	function pickImage(onSrc: (src: string) => void) {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/jpeg,image/gif,image/png,image/webp';
		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) return;
			if (file.size > 500 * 1024) {
				errorToast(t('tiptap.imgSizeLimit'));
				return;
			}
			const reader = new FileReader();
			reader.onload = (e) => {
				const src = e.target?.result as string;
				if (src) onSrc(src);
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}

	return { pickImage };
}
