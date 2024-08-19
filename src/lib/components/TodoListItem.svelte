<script lang="ts">
	import { closeUpdateOnOutsideClick } from '$lib/functions';
	import { todosStore } from '$lib/store/todo';
	import type { TodosType } from '$lib/types';
	import { IconDeviceFloppy, IconEdit, IconTrash } from '@tabler/icons-svelte';
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';

	export let currentTodo: TodosType;

	let isEdit = writable(false);
	let inputRef: HTMLInputElement;
	const { checkTodo, deleteTodo, editTodo } = todosStore;

	closeUpdateOnOutsideClick(isEdit);
</script>

<div class="py-3 px-4 rounded-md w-full shadow flex justify-between">
	<div class="flex gap-7 items-center w-[70%]">
		<input
			type="checkbox"
			name="check"
			id="check"
			class="size-5 flex-shrink-0"
			on:change={() => checkTodo(currentTodo)}
			checked={currentTodo.isChecked}
		/>

		{#if $isEdit}
			<input
				type="text"
				name="text-edit"
				id="text-edit"
				value={currentTodo.todo}
				class="focus:outline-none focus:border-b-blue-700 border-b-blue-500 border-b-2 w-full"
				bind:this={inputRef}
				on:keypress={(e) => editTodo({ currentTodo, e, isEdit })}
			/>
		{:else}
			<p class={currentTodo.isChecked ? 'line-through text-slate-300' : ''}>
				{currentTodo.todo}
			</p>
		{/if}
	</div>

	<div class="flex gap-5">
		{#if $isEdit}
			<button
				class="hover:bg-slate-200 rounded duration-200 disabled:opacity-20 disabled:pointer-events-none"
				on:click|stopPropagation={(e) => editTodo({ currentTodo, isEdit, inputRef, e })}
			>
				<IconDeviceFloppy class="hover:stroke-green-500" />
			</button>
		{:else}
			<button
				class="hover:bg-slate-200 rounded duration-200 disabled:opacity-20 disabled:pointer-events-none"
				on:click|stopPropagation={async (e) => {
					isEdit.set(!$isEdit);
					await tick();
					inputRef.focus();
				}}
			>
				<IconEdit class="stroke-blue-700" />
			</button>
		{/if}

		<button on:click={(e) => deleteTodo(currentTodo)}>
			<IconTrash class="stroke-red-500 duration-200 hover:stroke-red-700" />
		</button>
	</div>
</div>
