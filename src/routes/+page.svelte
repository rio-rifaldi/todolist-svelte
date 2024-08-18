<script lang="ts">
	import TodoListItem from '$lib/components/TodoListItem.svelte';
	import type { CustomeKeyboardEvent, TodosType } from '$lib/types';
	import { writable } from 'svelte/store';

	const todos = writable<TodosType[]>([]);
	function handleAddWithKey(this: HTMLInputElement, e: CustomeKeyboardEvent) {
		if (e.key !== 'Enter') return;
		if (this.value === '') return;
		console.log(this.value);

		let todoInput: TodosType = {
			id: Math.random(),
			isChecked: false,
			todo: this.value
		};
		todos.update(($todos) => [...$todos, todoInput]);
		this.value = '';
	}
	function handleAddWithButton(this: HTMLButtonElement) {
		let inputValue = (this.previousElementSibling as HTMLInputElement).value;
		if (inputValue === '') {
			return;
		}
		let todoInput = {
			id: Math.random(),
			isChecked: false,
			todo: inputValue
		};
		todos.update(($todos) => [...$todos, todoInput]);
		(this.previousElementSibling as HTMLInputElement).value = '';
	}
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
