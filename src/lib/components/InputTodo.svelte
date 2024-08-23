<script>
	import { todosStore } from '$lib/store/todo';
	import Button from './ui/button/button.svelte';

	import Input from './ui/input/input.svelte';
	const { createTodo } = todosStore;
</script>

<div class=" flex gap-3 my-5">
	<Input
		class="py-5 px-3 rounded shadow "
		type="text"
		placeholder="add todo here"
		on:keypress={createTodo}
	/>
	<Button
		type="submit"
		class="py-2 px-3 text-white bg-blue-600 hover:bg-blue-800 rounded shadow"
		on:click={createTodo}
	>
		add
	</Button>
</div>
