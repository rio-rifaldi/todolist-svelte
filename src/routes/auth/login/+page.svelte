<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	import type { SubmitFunction } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';

	const submitLogin: SubmitFunction = async ({}) => {
		return ({ update, result, formElement }) => {
			if (result.type === 'failure') {
				toast.error(result?.data?.message);
			}
			if (result.type === 'redirect') {
				formElement.reset();

				toast.success(`logined`);
			}
			update({ reset: true, invalidateAll: true });
		};
	};
</script>

<div class="place-self-center place-content-center w-full max-w-md h-[80vh]">
	<div class="shadow-lg p-7 mx-3 rounded">
		<h1 class="text-center text-3xl font-bold capitalize">login</h1>

		<form class="space-y-7 my-8" method="POST" use:enhance={submitLogin} autocomplete="off">
			<div class="space-y-2">
				<label for="username" class="text-slate-500">username</label>
				<Input type="text" id="username" name="username" />
			</div>
			<div class="space-y-2">
				<label for="password" class="text-slate-500">password</label>

				<Input type="password" id="password" name="password" />
			</div>
			{#if $page.form?.message}
				<p>{$page.form.message}</p>
			{/if}

			<div class="mt-16 flex flex-col gap-2 sm:flex-row">
				<Button class="w-full" type="submit">login</Button>
				<a href="/auth/register">
					<Button class="w-full" type="button" variant="outline">register</Button>
				</a>
			</div>
		</form>
	</div>
</div>
