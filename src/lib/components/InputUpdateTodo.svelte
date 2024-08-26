<script lang="ts">
	import { enhance } from '$app/forms';

	import type { TodosType } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Writable } from 'svelte/store';

	export let currentTodo: TodosType;
	export let isEdit: Writable<boolean>;

	let form: HTMLFormElement;

	const submitUpdateTodo: SubmitFunction = () => {
		return ({ update, result, formData }) => {
			const input = formData.get('todo-edit');
			if (result.type === 'success') {
				currentTodo.todo = String(input);
				update({ reset: true, invalidateAll: true });
				isEdit.set(false);
			}
		};
	};
</script>

<!-- svelte-ignore a11y-autofocus -->
<form
	bind:this={form}
	action="?/update"
	method="POST"
	use:enhance={submitUpdateTodo}
	autocomplete="off"
	autofocus
>
	<input
		type="text"
		name="todo-edit"
		id="todo-edit"
		value={currentTodo.todo}
		autofocus
		class="focus:outline-none focus:border-b-blue-700 border-b-blue-500 border-b-2 w-full"
		on:keypress={(e) => {
			if (e.key !== 'Enter') return;

			form.requestSubmit();
		}}
	/>
	<input
		type="hidden"
		name="todo-id"
		id="todo-edit"
		value={currentTodo.id}
		autofocus
		class="focus:outline-none focus:border-b-blue-700 border-b-blue-500 border-b-2 w-full"
	/>
</form>
