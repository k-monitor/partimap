<script setup lang="ts">
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Youtube } from '@tiptap/extension-youtube';

const html = defineModel<string>();

const editor = useEditor({
	content: html.value || '',
	extensions: [
		TiptapStarterKit,
		Image,
		Link.configure({
			openOnClick: false,
		}),
		Youtube.configure({
			height: 180,
			width: 240,
		}),
	],
	onUpdate: () => (html.value = editor.value?.getHTML()),
});

watch(html, (v) => {
	if (!editor.value) return;
	if (editor.value.getHTML() === v) return;
	editor.value.commands.setContent(v || '', false);
});

function addImage() {
	if (!editor.value) return;
	const src = window.prompt('URL');
	if (src) editor.value.chain().focus().setImage({ src }).run();
}

function addYoutube() {
	if (!editor.value) return;
	const src = window.prompt('YouTube video URL');
	if (src) editor.value.commands.setYoutubeVideo({ src });
}

function setLink() {
	if (!editor.value) return;
	const previousUrl = editor.value.getAttributes('link').href;
	const url = window.prompt('URL', previousUrl);
	if (url === null) return;
	if (url === '') {
		editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
		return;
	}
	editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}
</script>

<template>
	<div v-if="editor">
		<div class="bg-light border border-bottom-0 d-flex flex-wrap tiptap-toolbar">
			<div class="border-bottom border-end px-1">
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
			<div class="border-bottom border-end px-1">
				<b-button
					:class="{
						active: editor.isActive('heading', { level: 4 }),
					}"
					size="sm"
					variant="light"
					@click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
				>
					<i class="fas fa-heading me-1" />
					<strong>1</strong>
				</b-button>
				<b-button
					:class="{
						active: editor.isActive('heading', { level: 5 }),
					}"
					size="sm"
					variant="light"
					@click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
				>
					<i class="fas fa-heading me-1" />
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
			<div class="border-bottom border-end px-1 flex-grow-1">
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
					@click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
				>
					<i class="fas fa-fw fa-remove-format" />
				</b-button>
			</div>
		</div>
		<div class="border-top-0 form-control tiptap-editor">
			<TiptapEditorContent :editor="editor" />
		</div>
	</div>
</template>

<style>
.tiptap-editor {
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	height: auto;
	min-height: 50px;
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
