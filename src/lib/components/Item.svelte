<script>
	import { scale, fade } from 'svelte/transition';
    import { shouldCenter } from "../../userData";
	import { quadInOut } from "svelte/easing";
	export let title;
	export let body; // default value
	export let container;
	let x = 0; // horizontal position
	let y = 0; // vertical position
	let direction = Math.random() < 0.5 ? -1 : 1
	let dx = 0.5 * direction; // horizontal speed
	let dy = 0.5 * -direction; // vertical speed

	let containerWidth = 0;
	let containerHeight = 0;

	let dvdWidth; // width of your component
	let dvdHeight; // height of your component

	let item;
	let show = false;
	let speed = 3;
	function clamp(number, min, max) {
		return Math.max(min, Math.min(number, max));
	}

	function distance(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
	}


	function animate() {
		// update position


		if ($shouldCenter) {
			x += clamp(containerWidth / 2 - x, -speed, speed)
			y += clamp(containerHeight / 2 - y, -speed, speed)

			if (distance(x, y, containerWidth / 2, containerHeight / 2) < 10) {
				show = false
			}


		} else {
			x += dx;
			y += dy;

		}



		// bounce off walls
		if (x + dvdWidth / 2 > containerWidth || x - dvdWidth / 2 < 0) dx *= -1;
		if (y + dvdHeight / 2 > containerHeight || y - dvdHeight / 2 < 0) dy *= -1;

		requestAnimationFrame(animate);
		containerWidth = container.clientWidth;
		containerHeight = container.clientHeight;
	}

	// set container dimensions after mount
	import { onMount } from 'svelte';
	onMount(() => {
		containerWidth = container.clientWidth;
		containerHeight = container.clientHeight;
        x = containerWidth / 2
        y = containerHeight / 2

	});

    $: if (containerWidth != 0) {
        show = true
    }

    $: if (item) {
        
		dvdWidth = item.clientWidth;
		dvdHeight = item.clientHeight;

        const rect = item.getBoundingClientRect();
        setTimeout(() => {
            animate();
        }, 400)
		
    }

</script>

    {#if show}
	<div
		bind:this={item}
		class="absolute card w-96 bg-base-100 shadow-xl self-start transform origin-center"
		style="transform: translate(calc({x}px - 50%), calc({y}px - 50%));"
		transition:scale={{ duration: 400, start: 0, opacity: 0, easing: quadInOut }}
	>
		<div class="card-body">
			<h1 class="text-1xl card-title">{title}</h1>
			<p>{body}</p>
		</div>
	</div>
    {/if}

