<script>
	let occupation = '';
	let search = '';

    import { onMount } from 'svelte';
	import { degree, page, job, promptAI } from '../../userData';

	let data = {};
    let options = []

	onMount(async () => {
		const res = await fetch('/degrees.json');
		data = await res.json();
        options = data.d
	});

    function searchDegree() {
        if (data.d.includes(search)) {
            degree.update(p => search)
            page.update(p => 100)
            getDegree()

        } else {
            alert("Not a valid degree")
        }

    }

	async function getJobs() {
		job.update((p) => occupation);

		let degreeAI = await promptAI(
			`based on the occupation ${occupation}, pick one degree from this list ${data.d} that would match the job of a ${occupation}. output exactly just the degree as it says from the list and do not add any other text. just output how it is exactly writte from the list`
		);
		degree.update(p => degreeAI)
	}

	async function getDegree() {
		let degreeAI = await promptAI(
			`state one occupation that would be a good match for this degree ${$degree}. output exactly the occupation title and nothing else. no description`
		);
		job.update(p => degreeAI)
	}

	let showDropdown = false;

	$: filteredOptions = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));
</script>

<div
	class="flex flex-col form-control absolute w-full items-center max-w-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-[-100px] mb-2"
>
	<div>
		<input
			type="text"
			bind:value={search}
			placeholder="or enter a degree..."
			class="input input-bordered w-2/3"
			on:focus={() => (showDropdown = true)}
			on:blur={() => setTimeout(() => (showDropdown = false), 100)}
		/>


        {#if showDropdown && filteredOptions.length > 0}
            <ul
            class="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto"
            >
            {#each filteredOptions as option}
                <button
                    class="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer w-full"
                    on:click={() => { search = option}}
                >
                {option}
                </button>
            {/each}
            </ul>
        {/if}

		<button on:click={() => { searchDegree() }} class="btn font-normal rounded-full text-base">></button>
	</div>

	<div>
		<input
			type="text"
			placeholder="or enter a occupation..."
			bind:value={occupation}
			class="input input-bordered w-2/3 mb-1"
			,
		/>
		<button class="btn font-normal text-base rounded-full" on:click={getJobs}>></button>
	</div>
</div>
