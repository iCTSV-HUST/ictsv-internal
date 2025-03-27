<script lang="ts">
    import type { PageProps } from "./$types";

  const { data }: PageProps = $props()

</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <div class="card w-96 bg-base-100 shadow-xl p-6">
    <h1 class="text-xl font-bold mb-4">Sign in with Outlook</h1>
    <a href={data.authUrl} class="btn btn-primary w-full">Sign in</a>
  </div>
</div>