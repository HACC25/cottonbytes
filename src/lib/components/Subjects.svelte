<script>
    import { promptAI, userSubjects, page, userInterests, skills, job, shouldCenter, addComponent } from "../../userData";

    let query = "";
    let description = "what are topics or subjects that interests you?"
    async function getJobs() {
        page.update(p => p+=1)
        addComponent(description, query)

    }

</script>

<div
	class="form-control w-full max-w-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-2"
>
	<input
		type="text"
		placeholder={description}
		bind:value={query}
		class="input input-bordered w-full",
	/>
    <br/>
    <br/>

	<div class="w-full flex justify-center">
		<button class="max-w-xs btn mb-2" on:click={getJobs}>next</button>
    </div>
    
</div>
