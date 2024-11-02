<script lang='ts'>
	import toast from "svelte-french-toast";
	import { kdData } from "./kddata.svelte";
	import { goto } from "$app/navigation";

	let TestURL = $state("");

	function parseTestURL() {
		try {
			let addr = new URL(TestURL);
			let params = new URLSearchParams(addr.search);

			// info.AId = 
			// info.UserName = params.get("UserName");
			const AId = params.get("AId") ?? "";
			kdData.TokenCode = params.get("TokenCode") ?? "";
			kdData.AId = AId;

			goto(`/app/kd/${AId}`);
		} catch (err) {
			toast.error("Invalid URL", { position: "top-center" });
			console.error(err);
		}
	}
</script>

<div class="join">
<!--   <input class="input input-bordered join-item" placeholder="Email" />
	<button class="btn join-item rounded-r-full">Subscribe</button> -->

	<span class="join-item bg-base-300 px-4 flex items-center">URL ảnh</span>
	<!-- bg-base-300 px-4 flex items-center  -->

	<input class="join-item input input-bordered w-full" type="text" bind:value={TestURL} onchange={parseTestURL}
		placeholder="https://ctsv.hust.edu.vn/api-t/UploadFile/CTSV/Download?User. . ." />
</div>