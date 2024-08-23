<script lang="ts">
	import { todosStore } from '$lib/store/todo';
	import type { TodosType } from '$lib/types';

	import { writable } from 'svelte/store';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import InputUpdateTodo from './InputUpdateTodo.svelte';
	import TextTodo from './TextTodo.svelte';
	import { closeUpdateOnOutsideClick } from '$lib/utils/CloseUpdate';
	import { CircleX } from 'lucide-svelte';

	export let currentTodo: TodosType;

	let isEdit = writable(false);

	const { checkTodo, deleteTodo, todos } = todosStore;
	closeUpdateOnOutsideClick(isEdit);
</script>

<div class="py-3 px-4 rounded-md w-full shadow flex justify-between gap-4 my-3">
	<div class="flex gap-3 items-center w-full">
		<Input
			type="checkbox"
			name="check"
			id="check"
			class="size-5 flex-shrink-0 cursor-pointer"
			on:change={() => checkTodo(currentTodo)}
			checked={currentTodo.isChecked}
		/>

		{#if $isEdit}
			<InputUpdateTodo {currentTodo} {isEdit} />
		{:else}
			<TextTodo isChecked={currentTodo.isChecked} {isEdit}>
				{currentTodo.todo}
			</TextTodo>
		{/if}
	</div>

	<div class="flex md:gap-1">
		<Button on:click={(e) => deleteTodo(currentTodo)} variant={'ghost'} size={'icon'}>
			<CircleX class="stroke-red-500 duration-200 hover:stroke-red-700" />
		</Button>
	</div>
</div>
