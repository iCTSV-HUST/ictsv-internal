<script lang='ts'>
	export let showModal: boolean;

	let dialog: HTMLDialogElement;


	import JSConfetti from 'js-confetti';

	const jsConfetti = new JSConfetti();

	$: if (dialog && showModal) { dialog.showModal(); jsConfetti.addConfetti(); };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog class="bg-[#fadad4] flex flex-col items-center justify-center"
	class:hidden={!showModal}
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot />
		{jsConfetti.addConfetti()}
		<!-- svelte-ignore a11y-autofocus -->
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
