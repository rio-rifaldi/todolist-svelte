<script lang="ts">
	import type { TodosType } from '$lib/types';

	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { CircleX } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import InputUpdateTodo from './InputUpdateTodo.svelte';
	import TextTodo from './TextTodo.svelte';
	import Button from './ui/button/button.svelte';
	import { closeUpdate } from '$lib/utils/CloseUpdate';
	import { browser } from '$app/environment';

	export let currentTodo: TodosType;

	let isEdit = writable(false);

	let form: HTMLFormElement;
	const submitCheckTodo: SubmitFunction = () => {
		return ({ update, result }) => {
			if (result.type === 'success') {
				currentTodo.isChecked = !currentTodo.isChecked;
				update({ reset: false, invalidateAll: true });
			}
		};
	};
	browser && closeUpdate(isEdit);
</script>

<div class="py-3 px-4 rounded-md w-full shadow flex justify-between gap-4 my-3">
	<div class="flex gap-3 items-center w-full">
		<form action="?/check" method="POST" use:enhance={submitCheckTodo} bind:this={form}>
			<input
				type="checkbox"
				name="checkId"
				id="checkId"
				class="size-5 flex-shrink-0 cursor-pointer"
				value={currentTodo.id}
				checked={Boolean(currentTodo.isChecked) ?? true}
				on:change|preventDefault={async (item) => {
					form.requestSubmit();
				}}
			/>
			<input
				type="hidden"
				name="checkId"
				id="checkId"
				class="size-5 flex-shrink-0 cursor-pointer"
				checked={Boolean(currentTodo.isChecked)}
				value={currentTodo.id}
			/>
		</form>

		{#if $isEdit}
			<InputUpdateTodo {currentTodo} {isEdit} />
		{:else}
			<TextTodo isChecked={currentTodo.isChecked} {isEdit}>
				{currentTodo.todo}
			</TextTodo>
		{/if}
	</div>

	<form method="POST" class="flex md:gap-1" action="?/delete" use:enhance>
		<input type="hidden" name="id" value={currentTodo.id} />
		<Button variant={'ghost'} size={'icon'} type="submit">
			<CircleX class="stroke-red-500 duration-200 hover:stroke-red-700" />
		</Button>
	</form>
</div>
