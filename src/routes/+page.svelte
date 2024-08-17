<script lang="ts">
	import TodoListItem from '$lib/components/TodoListItem.svelte';
	import type { CustomeKeyboardEvent, CustomeMouseEvent, TodosType } from '$lib/types';
	import { writable } from 'svelte/store';

	const todos = writable<TodosType[]>([]);
	const handleAddWithKey = (e: CustomeKeyboardEvent) => {
		if (e.key !== 'Enter') return;
		if (e.currentTarget.value === '') return;

		let todoInput: TodosType = {
			id: Math.random(),
			isChecked: false,
			todo: e.currentTarget.value
		};
		todos.update(($todos) => [...$todos, todoInput]);
		e.currentTarget.value = '';
	};
	const handleAddWithButton = (e: CustomeMouseEvent) => {
		let inputValue = (e.currentTarget.previousElementSibling as HTMLInputElement).value;
		if (inputValue === '') {
			return;
		}
		let todoInput = {
			id: Math.random(),
			isChecked: false,
			todo: inputValue
		};
		todos.update(($todos) => [...$todos, todoInput]);
		(e.currentTarget.previousElementSibling as HTMLInputElement).value = '';
	};
</script>

<div class="w-full max-w-lg place-self-center" id="todolist">
	<div class=" flex gap-3 my-10">
		<input
			class="py-3 px-4 rounded shadow w-full"
			type="text"
			placeholder="add todo here"
			on:keypress={handleAddWithKey}
		/>
		<button
			type="submit"
			class="py-2 px-3 text-white bg-cyan-600 rounded shadow"
			on:click={handleAddWithButton}
		>
			add
		</button>
	</div>
	<div class="space-y-2">
		{#each $todos as todoItem}
			<TodoListItem currentTodo={todoItem} store={todos} />
		{/each}
	</div>
</div>
