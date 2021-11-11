<template>
	<div class="form-control tiptap-editor">
		<editor-content
			v-if="editor"
			:editor="editor"
		/>
	</div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';

export default {
	components: {
		EditorContent,
	},

	props: {
		value: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			editor: null,
		};
	},

	watch: {
		value(value) {
			if (!this.editor) {
				return;
			}
			const isSame = this.editor.getHTML() === value;
			if (isSame) {
				return;
			}
			this.editor.commands.setContent(value, false);
		},
	},

	mounted() {
		this.editor = new Editor({
			content: this.value,
			extensions: [StarterKit],
			onUpdate: () => {
				this.$emit('input', this.editor.getHTML());
			},
		});
	},

	beforeDestroy() {
		if (this.editor) {
			this.editor.destroy();
		}
	},
};
</script>

<style>
.tiptap-editor {
	height: auto;
}

.tiptap-editor .ProseMirror {
	outline: none;
}
</style>
