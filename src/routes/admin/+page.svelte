<script lang="ts">
    let error: boolean = false
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
</script>

{#await fetchData() then passwords}
    <div class="w-screen">
        <div class="w-1/2 h-screen p-8">
            <div class="w-full h-full rounded-2xl bg-base-300">
                {#if !error}
                    <table class="table table-zebra">
                        <thead>
                        <tr class="border-primary">
                            <th class="text-center">Password</th>
                            <th class="text-center">Max Uses</th>
                            <th class="text-center">Times Used</th>
                            <th class="text-center">Access IPs</th>
                            <th class="text-center">Uploads</th>
                        </tr>
                        </thead>
                        <tbody>
                        {#each passwords as data}
                            <tr>
                                <td class="text-center">{data["password"]}</td>
                                <td class="text-center">{data["max_uses"]}</td>
                                <td class="text-center">{data["times_used"]}</td>
                                <td class="text-center">{data["access_ips"]}</td>
                                <td class="text-center">
                                    {#if data["uploads"] !== null && data["uploads"].length > 1}
                                        <details class="dropdown dropdown-end">
                                            <summary class="btn btn-block btn-primary">Click to Reveal</summary>
                                            <ul class="menu dropdown-content bg-base-200 rounded-box z-[1] mt-1 w-fit p-2 shadow">
                                                {#each data["uploads"] as upload}
                                                    <li><button class="btn btn-xs my-1">{upload}</button></li>
                                                {/each}
                                            </ul>
                                        </details>
                                    {:else if data["uploads"] !== null && data["uploads"].length === 1}
                                        {data["uploads"][0]}
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                {/if}
            </div>
        </div>
    </div>
{/await}