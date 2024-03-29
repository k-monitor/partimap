<template>
	<div v-if="editor">
		<div
			class="bg-light border border-bottom-0 d-flex flex-wrap tiptap-toolbar"
		>
			<div class="border-bottom border-right px-1">
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
			</div>
			<div class="border-bottom border-right px-1">
				<b-button
					:class="{
						active: editor.isActive('heading', { level: 4 }),
					}"
					size="sm"
					variant="light"
					@click="
						editor.chain().focus().toggleHeading({ level: 4 }).run()
					"
				>
					<i class="fas _fa-fw fa-heading" />
					<strong>1</strong>
				</b-button>
				<b-button
					:class="{
						active: editor.isActive('heading', { level: 5 }),
					}"
					size="sm"
					variant="light"
					@click="
						editor.chain().focus().toggleHeading({ level: 5 }).run()
					"
				>
					<i class="fas _fa-fw fa-heading" />
					<strong>2</strong>
				</b-button>
				<b-button
					:class="{ active: editor.isActive('paragraph') }"
					size="sm"
					variant="light"
					@click="editor.chain().focus().setParagraph().run()"
				>
					<i class="fas fa-fw fa-paragraph" />
				</b-button>
				<b-button
					:class="{ active: editor.isActive('bulletList') }"
					size="sm"
					variant="light"
					@click="editor.chain().focus().toggleBulletList().run()"
				>
					<i class="fas fa-fw fa-list-ul" />
				</b-button>
			</div>
			<div class="border-bottom border-right px-1 flex-grow-1">
				<b-button
					:class="{ active: editor.isActive('bold') }"
					size="sm"
					variant="light"
					@click="editor.chain().focus().toggleBold().run()"
				>
					<i class="fas fa-fw fa-bold" />
				</b-button>
				<b-button
					:class="{ active: editor.isActive('italic') }"
					size="sm"
					variant="light"
					@click="editor.chain().focus().toggleItalic().run()"
				>
					<i class="fas fa-fw fa-italic" />
				</b-button>
				<b-button
					:class="{ active: editor.isActive('link') }"
					size="sm"
					variant="light"
					@click="setLink"
				>
					<i class="fas fa-fw fa-link" />
				</b-button>
				<b-button
					size="sm"
					variant="light"
					@click="addImage"
				>
					<i class="fas fa-fw fa-image" />
				</b-button>
				<b-button
					size="sm"
					variant="light"
					@click="addYoutube"
				>
					<i class="fab fa-fw fa-youtube" />
				</b-button>
			</div>
			<div class="border-bottom px-1">
				<b-button
					size="sm"
					variant="light"
					@click="
						editor
							.chain()
							.focus()
							.clearNodes()
							.unsetAllMarks()
							.run()
					"
				>
					<i class="fas fa-fw fa-remove-format" />
				</b-button>
			</div>
		</div>
		<div class="border-top-0 form-control tiptap-editor">
			<editor-content :editor="editor" />
		</div>
	</div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Youtube } from '@tiptap/extension-youtube';
import { StarterKit } from '@tiptap/starter-kit';

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
				Image,
				Link.configure({
					openOnClick: false,
				}),
				Youtube.configure({
					height: 180,
					width: 240,
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
		addImage() {
			const src = window.prompt('URL');
			if (src) {
				this.editor.chain().focus().setImage({ src }).run();
			}
		},
		addYoutube() {
			const src = window.prompt('YouTube video URL');
			if (src) {
				this.editor.commands.setYoutubeVideo({ src });
			}
		},
		setLink() {
			const previousUrl = this.editor.getAttributes('link').href;
			const url = window.prompt('URL', previousUrl);
			if (url === null) {
				return;
			}
			if (url === '') {
				this.editor
					.chain()
					.focus()
					.extendMarkRange('link')
					.unsetLink()
					.run();
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

.is-invalid .tiptap-editor {
	border-color: #dc3545;
}
</style>
