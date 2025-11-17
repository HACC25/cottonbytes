<script>
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	export let degreeName = '';

	let degreeData = {};
	let selectedProgram = null;

	onMount(async () => {
		const res = await fetch('/uh.json');
		degreeData = await res.json();
		selectedProgram = degreeData.find((program) =>
			program.program_name.toLowerCase().includes(degreeName.toLowerCase())
		);
	});

	// Find the selected degree program

	// Create stores for current year and semester
	const currentYearIndex = writable(0);
	const currentSemesterIndex = writable(0);

	// Navigation functions
	function nextSemester() {
		if (!selectedProgram) return;

		currentSemesterIndex.update((current) => {
			const currentYear = $currentYearIndex;
			const currentYearData = selectedProgram.years[currentYear];

			if (current < currentYearData.semesters.length - 1) {
				return current + 1;
			} else {
				// Move to next year
				if (currentYear < selectedProgram.years.length - 1) {
					currentYearIndex.update((year) => year + 1);
					return 0;
				}
				return current; // Stay on last semester
			}
		});
	}

	function previousSemester() {
		if (!selectedProgram) return;

		currentSemesterIndex.update((current) => {
			if (current > 0) {
				return current - 1;
			} else {
				// Move to previous year
				if ($currentYearIndex > 0) {
					currentYearIndex.update((year) => year - 1);
					const prevYear = selectedProgram.years[$currentYearIndex - 1];
					return prevYear.semesters.length - 1;
				}
				return current; // Stay on first semester
			}
		});
	}

	// Format semester name for display
	function formatSemesterName(name) {
		return name
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	// Get current semester data
	$: currentSemester = selectedProgram
		? selectedProgram.years[$currentYearIndex]?.semesters[$currentSemesterIndex]
		: null;

	$: currentYear = selectedProgram ? selectedProgram.years[$currentYearIndex] : null;

    function changeYear(year) {
		currentSemesterIndex.update((current) => {
            currentYearIndex.update((y) => year-1);
            console.log(year)
            return 0
		});
    }
</script>

<div class="max-w-4xl mx-auto p-4 w-full">
	{#if !selectedProgram}

	{:else}
		<!-- Program Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold mb-2">
				{selectedProgram.program_name}
			</h1>
			<p class="text-lg opacity-75">
				{selectedProgram.institution} • {selectedProgram.total_credits} Total Credits
			</p>
		</div>

		<!-- Semester Navigation -->
		<div class="flex justify-between items-center mb-6">
			<button
				class="btn btn-outline {$currentYearIndex === 0 && $currentSemesterIndex === 0
					? 'btn-disabled'
					: ''}"
				on:click={previousSemester}
				disabled={$currentYearIndex === 0 && $currentSemesterIndex === 0}
			>
				← Previous
			</button>

			<div class="text-center">
				<h2 class="text-2xl font-semibold">
					Year {currentYear.year_number} • {formatSemesterName(currentSemester.semester_name)}
				</h2>
				<p class="text-sm opacity-75">
					{currentSemester.credits} Credits
				</p>
			</div>

			<button
				class="btn btn-outline {selectedProgram.years.length - 1 === $currentYearIndex &&
				selectedProgram.years[$currentYearIndex].semesters.length - 1 === $currentSemesterIndex
					? 'btn-disabled'
					: ''}"
				on:click={nextSemester}
				disabled={selectedProgram.years.length - 1 === $currentYearIndex &&
					selectedProgram.years[$currentYearIndex].semesters.length - 1 === $currentSemesterIndex}
			>
				Next →
			</button>
		</div>

		<!-- Courses Card -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h3 class="card-title text-lg mb-4">Courses for this Semester</h3>

				{#if currentSemester.courses.length === 0}
					<div class="text-center py-8">
						<p class="text-lg opacity-75">No courses scheduled for this semester</p>
					</div>
				{:else}
					<div class="overflow-x-auto overflow-y-auto h-82">
						<table class="table table-zebra w-full overflow-y-auto h-64">
							<thead>
								<tr>
									<th class="w-3/4">Course Name</th>
									<th class="text-right">Credits</th>
								</tr>
							</thead>
							<tbody>
								{#each currentSemester.courses as course}
									<tr>
										<td class="font-medium">{course.name}</td>
										<td class="text-right">{course.credits}</td>
									</tr>
								{/each}
							</tbody>
							<tfoot>
								<tr>
									<th class="text-lg">Total Semester Credits</th>
									<th class="text-right text-lg">{currentSemester.credits}</th>
								</tr>
							</tfoot>
						</table>
					</div>
				{/if}
			</div>
		</div>

		<!-- Progress Indicator -->
		<div class="flex justify-center mt-6 space-x-2">
			{#each selectedProgram.years as year, yearIndex}
				{#each year.semesters as semester, semesterIndex}
					<div
						class="w-3 h-3 rounded-full transition-all duration-300 {$currentYearIndex ===
							yearIndex && $currentSemesterIndex === semesterIndex
							? 'bg-black'
							: 'bg-base-300'}"
						title="Year {year.year_number} - {formatSemesterName(semester.semester_name)}"
					></div>
				{/each}
			{/each}
		</div>

		<!-- Quick Navigation -->
		<div class="flex flex-wrap justify-center gap-2 mt-6">

			{#each selectedProgram.years as year, yearIndex}
                <button on:click={() => changeYear(year.year_number)} class="btn">Year {year.year_number}</button>
			{/each}
		</div>
			<button class="btn fixed bottom-4 left-4" style="" on:click={() => { location.reload();  }}>back to main screen</button>
		
		{/if}



</div>

