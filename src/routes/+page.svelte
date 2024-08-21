<script lang="ts">
	import InputTodo from '$lib/components/InputTodo.svelte';
	import TodoListItem from '$lib/components/TodoListItem.svelte';
	import { todosStore } from '$lib/store/todo';

	const { todos } = todosStore;
</script>

<div class="w-full max-w-lg place-self-center px-3" id="todolist">
	<InputTodo />
	<div class="space-y-2">
		{#each $todos as todoItem}
			<TodoListItem currentTodo={todoItem} />
		{/each}
	</div>
</div>
