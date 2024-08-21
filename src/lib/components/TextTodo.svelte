<script lang="ts">
	import type { TodosType } from '$lib/types';
	import type { Writable } from 'svelte/store';

	export let isChecked: boolean;
	export let isEdit: Writable<boolean>;
</script>

<button
	on:dblclick={() => {
		isEdit.set(!$isEdit);
	}}
	class={isChecked ? 'line-through text-slate-300 text-left' : ' text-left '}
>
	<slot />
</button>
