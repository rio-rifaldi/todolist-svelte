<script lang="ts">
	import type { Writable } from 'svelte/store';
	import DeleteAllTodo from './DeleteAllTodo.svelte';
	import Sort from './Sort.svelte';
	import type { TodoDate } from '$lib/types';

	export let todoDate: Writable<TodoDate>;
</script>

<div class="flex justify-between">
	<Sort {todoDate} />
	<DeleteAllTodo />
</div>
