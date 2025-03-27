<script lang="ts">
  export let emails;
</script>

<div class="flex flex-col items-center min-h-screen bg-gray-100">
  <div class="w-full max-w-2xl p-6">
    <h1 class="text-2xl font-bold mb-4">Inbox</h1>
    <div class="space-y-4">
      {#each emails as email}
        <div class="card bg-base-100 shadow-md p-4">
          <h2 class="font-semibold">{email.subject}</h2>
          <p class="text-gray-600">{email.snippet}</p>
        </div>
      {/each}
    </div>
  </div>
</div>