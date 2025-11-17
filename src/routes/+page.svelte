<script>
	import { fly, scale } from 'svelte/transition';
	import { slide } from 'svelte/transition';
	import { degree, page } from '../userData';
	import { quadInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import { onMount } from 'svelte';
	import Skills from '$lib/components/Skills.svelte';
	import Hobby from '$lib/components/Hobby.svelte';
	import Subjects from '$lib/components/Subjects.svelte';
	import Item from '$lib/components/Item.svelte';
	import IdealDay from '$lib/components/IdealDay.svelte';
	import SemesterViewer from '$lib/components/SemesterViewer.svelte';
	import DegreeEntry from '$lib/components/DegreeEntry.svelte';

	import { items, job } from '../userData';

	// optional data for your card
	let title = 'UH Pathfinder AI';
	let description = 'Discover your educational pathway in Hawai‘i 🌺';
	let show = false;
	let text = '';
	let container;
	let y = 0;
	let offset = new Tween(50, {
		duration: 400,
		easing: quadInOut
	});
	let showDegree = false;

	$: if ($job != '') {
		offset.target = 100000;
		console.log('wasd');
	}

	$: y = offset.current;

	// Run after component mounts
	onMount(() => {
		show = true;
	});
</script>

<!-- Full-screen flexbox that centers everything -->
{#if show && !showDegree}
	<div class="flex justify-center h-screen bg-base-200">
		<div bind:this={container} class="absolute w-full h-screen overflow-hidden">
			{#each $items as item}
				<Item title={item.n} body={item.b} {container}></Item>
			{/each}
		</div>
		<div
			id="titleCard"
			,
			class="card w-96 bg-base-100 shadow-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-{y}"
			in:fly={{ y: 100, duration: 500 }}
			on:outroend={() => (show = false)}
		>
			<div class="card-body text-center">
				<h2 class="card-title card-actions justify-center text-3xl">
					{title}
				</h2>
				<p>{description}</p>
				<div class="card-actions justify-center"></div>
			</div>
		</div>


		{#if $job == ''}
			{#if $page === 0}
				<Hobby></Hobby>
			{:else if $page === 1}
				<Skills></Skills>
			{:else if $page === 2}
				<Subjects></Subjects>
			{:else if $page === 3}
				<IdealDay></IdealDay>
			<!-- svelte-ignore block_empty -->
			{:else}

			{/if}
		{/if}
		<div class="flex flex-col justify-center items-center h-screen z-10">
			{#if $job != ''}
				<h1
					in:scale={{ duration: 400, start: 0, opacity: 0, easing: quadInOut }}
					class="text-3xl w-full text-center p-2"
				>
					{$job}
				</h1>
			{/if}

			{#if $job != '' || $degree != ''}
				<h1
					in:scale={{ duration: 400, start: 0, opacity: 0, easing: quadInOut }}
					class="text-2xl w-full text-center p-2"
				>
					{$degree == "" ? "loading degree..." : $degree}
				</h1>
				{#if $degree != ""}
				<button
					class="btn p-2"
					on:click={() => {
						showDegree = true;
					}}>explore degree</button
				>
				{/if}
			{/if}
		</div>
	</div>
	{#if $job == '' && $degree == ''}
		<DegreeEntry></DegreeEntry>
	{/if}
{:else}
	<SemesterViewer degreeName={$degree}></SemesterViewer>
{/if}

<style>
	#titleCard {
		position: fixed;
	}
</style>


