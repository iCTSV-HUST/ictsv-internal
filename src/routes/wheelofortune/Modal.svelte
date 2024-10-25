<script lang='ts'>
	import { run } from 'svelte/legacy';


	let dialog: HTMLDialogElement = $state();


	import JSConfetti from 'js-confetti';
	interface Props {
		showModal: boolean;
		onclick?: (event: any) => void;
		children?: import('svelte').Snippet;
	}

	let { showModal = $bindable(), onclick, children }: Props = $props();

	const jsConfetti = new JSConfetti();

	run(() => {
		if (dialog && showModal) { dialog.showModal(); jsConfetti.addConfetti(); }
	});;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog class="bg-[#fadad4] flex flex-col items-center justify-center"
	class:hidden={!showModal}
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(event) => {
		// @migration-task: incorporate self modifier
		dialog.close()
	}}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div {onclick}>
		{@render children?.()}
		{jsConfetti.addConfetti()}
		<!-- svelte-ignore a11y_autofocus -->
		<!-- <button autofocus on:click={() => dialog.close()}>close modal</button> -->
	</div>
</dialog>

<style>
	dialog {
		margin-top: 18rem;
		width: 30rem;
		height: 25rem;
		border-radius: 1rem;
		border: none;
		padding: 0px;
		text-align: center;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1.5);
	}
	@keyframes zoom {
		from {
			transform: scale(0.8);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
/*	button {
		display: block;
	}*/
</style>
