<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Dialog from '$lib/components/ui/dialog';
	import { DialogTrigger } from '$lib/components/ui/dialog';
	import { Trash2Icon } from 'lucide-svelte';
	import { Button, buttonVariants } from './ui/button';
	import type { SubmitFunction } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';

	const submitDeleteAll: SubmitFunction = () => {
		return ({ update, result }) => {
			if (result.type === 'success') {
				toast.success('todo deleted');
			}
			update({ invalidateAll: true, reset: true });
		};
	};
</script>

<div>
	<Dialog.Root>
		<DialogTrigger class={`${buttonVariants({ variant: 'ghost', size: 'icon' })} group`}>
			<Trash2Icon class="stroke-red-500  group-hover:scale-105 duration-200" />
		</DialogTrigger>

		<Dialog.Content class=" max-w-sm p-10">
			<Dialog.Header>
				<Dialog.Title class="text-xl">Are you sure absolutely sure delete All todo?</Dialog.Title>
			</Dialog.Header>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</Dialog.Description>

			<div class="flex mt-5 gap-5 justify-end">
				<Dialog.Close>
					<Button variant="outline">Back</Button>
				</Dialog.Close>
				<Dialog.Close>
					<form action="?/deleteAll" use:enhance={submitDeleteAll} method="POST">
						<Button variant="destructive" type="submit">Delete</Button>
					</form>
				</Dialog.Close>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</div>
