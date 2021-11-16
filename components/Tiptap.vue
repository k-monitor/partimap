<template>
	<div v-if="editor">
		<div class="bg-light border border-bottom-0 tiptap-toolbar">
			<b-button
				size="sm"
				variant="light"
				@click="editor.chain().focus().undo().run()"
			>
				<i class="fas fa-fw fa-undo" />
			</b-button>
			<b-button
				size="sm"
				variant="light"
				@click="editor.chain().focus().redo().run()"
			>
				<i class="fas fa-fw fa-redo" />
			</b-button>
			<b-button
				:class="{ 'active' : editor.isActive('bold') }"
				size="sm"
				variant="light"
				@click="editor.chain().focus().toggleBold().run()"
			>
				<i class="fas fa-fw fa-bold" />
			</b-button>
			<b-button
				:class="{ 'active' : editor.isActive('italic') }"
				size="sm"
				variant="light"
				@click="editor.chain().focus().toggleItalic().run()"
			>
				<i class="fas fa-fw fa-italic" />
			</b-button>
			<b-button
				:class="{ 'active': editor.isActive('link') }"
				size="sm"
				variant="light"
				@click="setLink"
			>
				<i class="fas fa-fw fa-link" />
			</b-button>
			<b-button
				:class="{ 'active': editor.isActive('bulletList') }"
				size="sm"
				variant="light"
				@click="editor.chain().focus().toggleBulletList().run()"
			>
				<i class="fas fa-fw fa-list-ul" />
			</b-button>
		</div>
		<div class="form-control tiptap-editor">
			<editor-content :editor="editor" />
		</div>
	</div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import Link from '@tiptap/extension-link';
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
			extensions: [
				StarterKit,
				Link.configure({
					openOnClick: false,
				}),
			],
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

	methods: {
		setLink() {
			const previousUrl = this.editor.getAttributes('link').href;
			const url = window.prompt('URL', previousUrl);
			if (url === null) {
				return;
			}
			if (url === '') {
				this.editor.chain().focus().extendMarkRange('link').unsetLink().run();
				return;
			}
			this.editor
				.chain()
				.focus()
				.extendMarkRange('link')
				.setLink({ href: url })
				.run();
		},
	},
};
</script>

<style>
.tiptap-editor {
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	height: auto;
}

.tiptap-editor .ProseMirror {
	outline: none;
}

.tiptap-toolbar {
	border-top-left-radius: 0.25rem;
	border-top-right-radius: 0.25rem;
}
</style>
