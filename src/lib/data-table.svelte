<script lang="ts">
  import Icon from "@iconify/svelte";
  import { enhance } from "$app/forms";

  export let refresh: boolean = false;
  let error: boolean = false;
  let apiData = fetchData();

  let passwordToRemove: string

  async function fetchData() {
    const response = await fetch("/api/db");
    const json = await response.json();
    if (json["error"] !== null) {
      error = true;
      return null;
    }

    error = false;
    return json["data"];
  }

  function openModal(password: string) {
    passwordToRemove = password;
    modal.showModal()
  }
  $: if (refresh) {
    apiData = fetchData();
    refresh = false;
  }
</script>

<dialog id="modal" class="modal modal-bottom sm:modal-middle text-center">
  <div class="modal-box">
    <h3 class="text-lg font-bold">
      Are you sure you want to delete {passwordToRemove} and its associated files?
    </h3>
    <form use:enhance method="POST" action="?/deletePassword">
      <input id="password" name="password" class="hidden" value={passwordToRemove} />
      <button class="mt-2 btn btn-error" on:click={() => modal.close()}>Delete Password</button>
    </form>
  </div>
</dialog>

<table class="table table-zebra">
  <thead>
    <tr class="border-primary">
      <th class="text-center text-base-content">Password</th>
      <th class="text-center text-base-content">Max Uses</th>
      <th class="text-center text-base-content">Times Used</th>
      <th class="text-center text-base-content">Uploads</th>
      <th class="text-center w-5"></th>
    </tr>
  </thead>
  {#await apiData then passwords}
    {#if !error}
      <tbody>
        {#each passwords as data}
          <tr>
            <td class="text-center font-bold">{data["password"]}</td>
            <td class="text-center">{data["max_uses"]}</td>
            <td class="text-center">{data["times_used"]}</td>
            <td class="text-center">
              {#if data["uploads"] !== null && data["uploads"].length > 1}
                <details class="dropdown dropdown-end">
                  <summary class="text-xs md:btn-sm btn btn-block btn-primary">Click to Reveal</summary>
                  <ul class="menu dropdown-content bg-base-200 rounded-box z-[1] mt-1 w-fit p-2 shadow">
                    {#each data["uploads"] as upload}
                      <li>
                        <a target="_blank" rel="noopener noreferrer" href={`/admin/files/${upload}`} class="btn btn-xs my-1">
                          {upload}
                        </a>
                      </li>
                    {/each}
                  </ul>
                </details>
              {:else if data["uploads"] !== null && data["uploads"].length === 1}
                <a target="_blank" rel="noopener noreferrer" href={`/admin/files/${data["uploads"][0]}`} class="link link-hover font-bold my-1">
                  {data["uploads"][0]}
                </a>
              {:else}
                No Uploads Yet!
              {/if}
            </td>
            <td class="text-center">
              <button on:click={() => openModal(data["password"])}>
                <Icon icon="mingcute:delete-2-fill" height="18px" class="text-error" />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    {:else}
      <p class="w-full h-full text-center absolute font-bold mt-5">No passwords yet!</p>
    {/if}
  {/await}
</table>
