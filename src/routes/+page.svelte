<script lang="ts">
	import TodoListItem from '$lib/components/TodoListItem.svelte';
	import { todosStore } from '$lib/store/todo';

	const { todos, createTodoWithKey, createTodoWithButton } = todosStore;
</script>

<div class="w-full max-w-lg place-self-center" id="todolist">
	<div class=" flex gap-3 my-10">
		<input
			class="py-3 px-4 rounded shadow w-full"
			type="text"
			placeholder="add todo here"
			on:keypress={createTodoWithKey}
		/>
		<button
			type="submit"
			class="py-2 px-3 text-white bg-cyan-600 rounded shadow"
			on:click={createTodoWithButton}
		>
			add
		</button>
	</div>
	<div class="space-y-2">
		{#each $todos as todoItem}
			<TodoListItem currentTodo={todoItem} />
		{/each}
	</div>
</div>
