<script lang="ts">
	import * as Select from '$lib/components/ui/select';

	import type { TodoDate } from '$lib/types';
	import { Calendar, ChevronsDownUp } from 'lucide-svelte';
	import type { Writable } from 'svelte/store';
	import Button from './ui/button/button.svelte';

	type SortOption = 'created' | 'updated';

	export let todoDate: Writable<TodoDate>;
	// const todos = $page.data.todos as TodosType[];

	// function sortBy(options: SortOption) {
	// 	if (options === 'created') {
	// 		todos.sort((a, b) => {
	// 			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	// 		});
	// 	} else if (options === 'updated') {
	// 		todos.sort((a, b) => {
	// 			return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
	// 		});
	// 	}
	// }

	const options = [
		{ value: 'created', label: 'Created' },
		{ value: 'updated', label: 'Updated' }
	];
	type Options = {
		value: 'created' | 'updated';
		label: string;
		disabled: boolean;
	};

	function onselectedchange(data: any) {
		const selected: Options = data;
		if (selected.value === 'created') {
			todoDate.set({ isShow: true, sort: { created: selected.value, updated: '' } });
		} else if (selected.value === 'updated') {
			todoDate.set({ isShow: true, sort: { created: '', updated: selected.value } });
		}
		// sortBy(selected.value);
	}
	function disableSortingDate() {
		todoDate.set({ isShow: false, sort: { created: '', updated: '' } });
	}
</script>

<div class="flex gap-2 flex-row-reverse">
	<Select.Root
		items={options}
		onSelectedChange={onselectedchange}
		selected={$todoDate.isShow === false ? { label: 'sort by', value: 'any' } : undefined}
	>
		<Select.Trigger class="w-[180px]">
			<Calendar size={18} class={'stroke-slate-500'} />
			<Select.Value placeholder="Sort By" />
		</Select.Trigger>
		<Select.Content>
			{#each options as option}
				<Select.Item value={option.value} label={option.label} class="capitalize"
					>{option.label}</Select.Item
				>
			{/each}
		</Select.Content>
	</Select.Root>

	<Button size="icon" variant="ghost" disabled={!$todoDate.isShow} on:click={disableSortingDate}
		><ChevronsDownUp size={18} /></Button
	>
</div>
