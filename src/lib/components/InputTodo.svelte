<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Button from './ui/button/button.svelte';

	import Input from './ui/input/input.svelte';

	const submitCreateTodo: SubmitFunction = ({
		formElement,
		action,
		controller,
		formData,
		submitter
	}) => {
		return async ({ result, update }) => {
			update();
		};
	};
</script>

<!-- svelte-ignore a11y-autofocus -->
<form
	class=" flex gap-3 my-5"
	action="?/create"
	method="POST"
	autofocus
	autocomplete="off"
	use:enhance
>
	<Input
		class="py-5 px-3 rounded shadow"
		type="text"
		placeholder="add todo here"
		required
		name="todo"
	/>
	<Button type="submit" class="py-2 px-3 text-white bg-blue-600 hover:bg-blue-800 rounded shadow">
		add
	</Button>
</form>
