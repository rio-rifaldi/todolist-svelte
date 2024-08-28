<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import blankProfile from '$lib/assets/profile-blank.png';
	import { page } from '$app/stores';
	import Button from './ui/button/button.svelte';

	$: username = $page.data?.user?.username;
	console.log();
</script>

<Popover.Root>
	<Popover.Trigger class=" place-self-end ">
		<img
			src={username ? `https://i.pravatar.cc/100?u=${username}` : blankProfile}
			alt="blank profile"
			class="size-12 sm:size-16 rounded-full bg-slate-100"
		/>
	</Popover.Trigger>
	<Popover.Content class={'w-[15rem] grid place-items-center gap-4 '}>
		{#if username}
			<div class="space-y-3 text-center">
				<img
					src={`https://i.pravatar.cc/100?u=${username}`}
					alt="blank profile"
					class="size-20 rounded-full bg-slate-100"
				/>
				<p>{username}</p>
			</div>
			<div class="flex gap-2">
				<a href="/auth/register">
					<Button size="sm" class="bg-blue-600 hover:bg-blue-700">new user</Button>
				</a>
				<form action="?/logout" method="POST">
					<Button type="submit" size="sm" variant="destructive">logout</Button>
				</form>
			</div>
		{:else}
			<div class="space-y-8">
				<img src={blankProfile} alt="blank profile" class="size-14 rounded-full bg-slate-100" />
			</div>
			<div class="flex gap-2">
				<a href="/auth/login">
					<Button size="sm">Login</Button>
				</a>
				<a href="/auth/register">
					<Button size="sm">Register</Button>
				</a>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
