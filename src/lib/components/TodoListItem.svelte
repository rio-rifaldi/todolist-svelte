<script lang="ts">
	import type { CustomeMouseEvent, TodosType } from '$lib/types';
	import { IconTrash, IconEdit, IconCheck } from '@tabler/icons-svelte';
	import { writable, type Writable } from 'svelte/store';

	export let currentTodo: TodosType;
	export let store: Writable<TodosType[]>;

	let isEdit = writable(false);

	const handleDelete = (e: CustomeMouseEvent) => {
		store.update(($todos) => $todos.filter((item) => item.id !== currentTodo.id));
	};
	const handleCheck = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		store.update(($todos) => {
			const currentIndex = $todos.findIndex((item) => item.id === currentTodo.id);
			const { id, isChecked, todo } = currentTodo;

			const newTodo = { id, todo, isChecked: !isChecked };
			$todos.splice(currentIndex, 1, newTodo);
			return $todos;
		});
	};

	window.addEventListener('click', (e) => {
		if (document.getElementById('todolist')?.contains(e.target as Node)) {
			return;
		} else {
			isEdit.set(false);
		}
	});
</script>

<div class="py-3 px-4 rounded-md w-full shadow flex justify-between">
	<div class="flex gap-7 items-center w-[70%]">
		<input
			type="checkbox"
			name="check"
			id="check"
			class="size-5"
			on:change={handleCheck}
			checked={currentTodo.isChecked}
		/>
		{#if currentTodo.isChecked}
			{#if $isEdit}
				<input
					type="text"
					name="text update"
					class="w-full focus:"
					placeholder={`previous : ${currentTodo.todo}`}
				/>
			{:else}
				<p class="line-through text-slate-400" on:dblclick|once={() => isEdit.set(!$isEdit)}>
					{currentTodo.todo}
				</p>
			{/if}
		{:else if $isEdit}
			<input
				type="text"
				name="text update"
				class="w-5/6 focus:outline-0 text-green-500"
				placeholder={`previous : ${currentTodo.todo}`}
			/>
		{:else}
			<p
				on:dblclick|once={(e) => {
					isEdit.set(!$isEdit);
				}}
			>
				{currentTodo.todo}
			</p>
		{/if}
	</div>

	<div class="flex gap-5">
		{#if $isEdit}
			<button class="hover:bg-slate-200 rounded duration-200">
				<IconCheck class="stroke-green-700" />
			</button>
		{/if}
		<button on:click={handleDelete}>
			<IconTrash class="stroke-red-700" />
		</button>
	</div>
</div>
