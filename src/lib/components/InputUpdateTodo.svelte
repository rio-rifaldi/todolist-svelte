<script lang="ts">
	import { todosStore } from '$lib/store/todo';
	import type { TodosType } from '$lib/types';
	import type { Writable } from 'svelte/store';

	export let currentTodo: TodosType;
	export let isEdit: Writable<boolean>;

	const { editTodo } = todosStore;
</script>

<!-- svelte-ignore a11y-autofocus -->
<input
	type="text"
	name="text-edit"
	id="text-edit"
	value={currentTodo.todo}
	autofocus
	class="focus:outline-none focus:border-b-blue-700 border-b-blue-500 border-b-2 w-full"
	on:keypress={(e) => {
		return editTodo({ e, currentTodo, isEdit });
	}}
/>
