<script lang="ts">
	import type { CustomeKeyboardEvent, CustomeMouseEvent, TodosType } from '$lib/types';
	import { IconTrash, IconEdit, IconCheck, IconDeviceFloppy } from '@tabler/icons-svelte';
	import { onMount, tick } from 'svelte';
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

	function handleEdit(e: CustomeKeyboardEvent) {
		if (e.key !== 'Enter') return;
		if (e.currentTarget.value === '') return;

		store.update(($todos) => {
			const currentIndex = $todos.findIndex((item) => item.id === currentTodo.id);
			const { id, isChecked, todo } = currentTodo;

			const newTodo = { id, isChecked, todo: e.currentTarget.value };
			$todos.splice(currentIndex, 1, newTodo);
			return $todos;
		});
		isEdit.set(false);
	}

	const handleUpdateWithButton = (e: CustomeMouseEvent) => {
		let inputValue = input.value;
		if (inputValue === '') return;

		store.update(($todos) => {
			const currentIndex = $todos.findIndex((item) => item.id === currentTodo.id);
			const { id, isChecked, todo } = currentTodo;

			const newTodo = { id, isChecked, todo: inputValue };
			$todos.splice(currentIndex, 1, newTodo);
			return $todos;
		});
		isEdit.set(false);
	};

	window.addEventListener('click', (e) => {
		if (document.getElementById('todolist')?.contains(e.target as Node)) {
			return;
		} else {
			isEdit.set(false);
		}
	});

	let input: HTMLInputElement;
</script>

<div class="py-3 px-4 rounded-md w-full shadow flex justify-between">
	<div class="flex gap-7 items-center w-[70%]">
		<input
			type="checkbox"
			name="check"
			id="check"
			class="size-5 flex-shrink-0"
			on:change={handleCheck}
			checked={currentTodo.isChecked}
		/>

		{#if $isEdit}
			<input
				type="text"
				name="text-edit"
				id="text-edit"
				value={currentTodo.todo}
				class="focus:outline-none focus:border-b-blue-700 border-b-blue-500 border-b-2 w-full"
				bind:this={input}
				on:keypress={handleEdit}
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
				on:click|stopPropagation={handleUpdateWithButton}
			>
				<IconDeviceFloppy class="hover:stroke-green-500" />
			</button>
		{:else}
			<button
				class="hover:bg-slate-200 rounded duration-200 disabled:opacity-20 disabled:pointer-events-none"
				on:click|stopPropagation={async (e) => {
					isEdit.set(!$isEdit);
					await tick();
					input.focus();
				}}
			>
				<IconEdit class="stroke-blue-700" />
			</button>
		{/if}

		<button on:click={handleDelete}>
			<IconTrash class="stroke-red-500 duration-200 hover:stroke-red-700" />
		</button>
	</div>
</div>
