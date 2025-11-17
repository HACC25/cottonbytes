<script>
	import {
		promptAI,
		userSubjects,
		page,
		userInterests,
		skills,
		job,
		shouldCenter,
        degree
	} from '../../userData';

    import { onMount } from 'svelte';

	let query = '';
	let data = {};

	onMount(async () => {
		const res = await fetch('/degrees.json');
		data = await res.json();
	});
	async function getJobs() {
		userSubjects.update((p) => query);
		shouldCenter.update((p) => true);
		//page.update(p => p+=1)
		var prompt = `Based on ${$userSubjects}, ${$userInterests}, ${$skills}, and a ideal day of ${query} output exactly **one singular job title only** that would require a college degree. 
Do not add any numbers, explanation, or extra text. pay extreme attention to ${$skills} ${$userSubjects}. 
Output should be one line: the job title alone.`;

		console.log(prompt)

		let text = await promptAI(prompt);
		job.update((p) => text);

		let degreeAI = await promptAI(
			`pick one degree and just state one degree from this list, ${data.d} that would match the job of a ${text}. output exactly just the degree as it says from the list and do not add any other text`
		);
		degree.update(p => degreeAI)
	}
</script>

<div
	class="form-control w-full max-w-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-2"
>
	<input
		type="text"
		placeholder="describe your ideal working day"
		bind:value={query}
		class="input input-bordered w-full"
		,
	/>
	<br />
	<br />

	<div class="w-full flex justify-center">
		<button class="max-w-xs btn mb-2" on:click={getJobs}>next</button>
	</div>
</div>
