<script>
	import { todosStore } from '$lib/store/todo';
	import Button from './ui/button/button.svelte';

	import Input from './ui/input/input.svelte';
	const { createTodo } = todosStore;
</script>

<div class=" flex gap-3 my-10">
	<Input
		class="py-5 px-3 rounded shadow "
		type="text"
		placeholder="add todo here"
		on:keypress={createTodo}
	/>
	<Button
		type="submit"
		class="py-2 px-3 text-white bg-cyan-600 rounded shadow"
		on:click={createTodo}
	>
		add
	</Button>
</div>
