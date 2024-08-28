<script lang="ts">
	import { page } from '$app/stores';
	import empty from '$lib/assets/empty.svg';
	import Filter from '$lib/components/Filter.svelte';
	import InputTodo from '$lib/components/InputTodo.svelte';
	import PopoverProfile from '$lib/components/PopoverProfile.svelte';
	import TodoListItem from '$lib/components/TodoListItem.svelte';
	import type { TodoDate, TodosType } from '$lib/types';
	import { getRelativeTime } from '$lib/utils/GetRelativeTime';
	import { IsNotEmpty } from '$lib/utils/IsNotEmpty';
	import { writable } from 'svelte/store';
	import type { ActionData, PageServerData } from './$types';

	export let data: PageServerData;
	export let form: ActionData;

	$: todos = (data.todos as unknown as TodosType[]) ?? [];
	const todoDate = writable<TodoDate>({
		isShow: false,
		sort: {
			created: '',
			updated: ''
		}
	});

	const user = $page.data?.user?.username as string | undefined;
</script>

<PopoverProfile />

<div class="w-full max-w-lg place-self-center mt-7" id="todolist">
	{#if form?.error}
		<p>{form.error}</p>
	{/if}
	<InputTodo />

	{#if IsNotEmpty(todos)}
		<Filter {todoDate} />
	{:else}
		<img src={empty} alt="empty ilustration" class="max-w-md mx-auto" />
	{/if}
	<div class="mt-10">
		{#each todos as todoItem, index}
			{#if $todoDate.isShow && $todoDate.sort.created}
				<!-- {#if new Date(todoItem.createdAt).getHours() !== new Date(todos[index - 1]?.createdAt).getHours()} -->
				<p class="text-xs mt-10">{getRelativeTime(todoItem.createdAt)}</p>
				<!-- {/if} -->
			{/if}
			{#if $todoDate.isShow && $todoDate.sort.updated}
				<!-- {#if new Date(todoItem.updatedAt).getHours() !== new Date(todos[index - 1]?.updatedAt).getHours()} -->
				<p class="text-xs mt-10">{getRelativeTime(todoItem.updatedAt)}</p>
				<!-- {/if} -->
			{/if}
			<TodoListItem currentTodo={todoItem} />
		{/each}
	</div>
</div>
