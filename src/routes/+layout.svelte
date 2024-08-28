<script>
	import { page } from '$app/stores';
	import { Toaster } from 'svelte-french-toast';
	import '../styles/index.css';

	$: username = $page.data?.user?.username;
</script>

<svelte:head>
	{#if username}
		<title>{`${username}'s Todolist`}</title>
	{:else}
		<title>Todolist App</title>
	{/if}
</svelte:head>

<div>
	<Toaster />
	<header></header>

	<main class="grid px-3 py-7">
		<slot />
	</main>

	<footer></footer>
</div>
