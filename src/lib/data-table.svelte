<script lang="ts">
    export let refresh: boolean = false;
    let error: boolean = false
    let apiData = fetchData()

    async function fetchData() {
        const response = await fetch("/api/db")
        const json = await response.json()
        if (json["error"] !== null) {
            error = true
            return null
        }

        error = false
        return json["data"]
    }

    $: if (refresh) {
        apiData = fetchData()
        refresh = false
    }
</script>
{#await apiData then passwords}
    {#if !error}
        <table class="table table-zebra">
            <thead>
                <tr class="border-primary">
                    <th class="text-center text-base-content">Password</th>
                    <th class="text-center text-base-content">Max Uses</th>
                    <th class="text-center text-base-content">Times Used</th>
                    <th class="text-center text-base-content">Uploads</th>
                </tr>
            </thead>
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
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={`/admin/files/${upload}`}
                                                class="btn btn-xs my-1">
                                                {upload}
                                            </a>
                                        </li>
                                    {/each}
                                </ul>
                            </details>
                        {:else if data["uploads"] !== null && data["uploads"].length === 1}
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={`/admin/files/${data["uploads"][0]}`}
                                class="link link-hover font-bold my-1">
                                {data["uploads"][0]}
                            </a>
                        {:else}
                            No Uploads Yet!
                        {/if}
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    {:else}
        <table class="table">
            <thead>
            <tr class="border-primary">
                <th class="text-center text-base-content">Password</th>
                <th class="text-center text-base-content">Max Uses</th>
                <th class="text-center text-base-content">Times Used</th>
                <th class="text-center text-base-content">Uploads</th>
            </tr>
            </thead>
        </table>
        <div class="h-fit w-full absolute left-0 top-1/2 -translate-y-1/2">
            <p class="text-center font-bold">No passwords were found in the database.</p>
        </div>
    {/if}
{/await}