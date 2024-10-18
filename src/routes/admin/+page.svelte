<script lang="ts">
    import DataTable from "\$lib/data-table.svelte";
    import {enhance} from "$app/forms";
</script>

<head>
    <title>Lockbox Admin</title>
</head>

<div class="w-screen h-screen relative md:flex">
    <div class="w-full md:w-1/2 h-screen md:pl-6 md:py-6 md:pr-3 relative">
        <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
            <DataTable />
        </div>
    </div>
    <div class="md:grid h-full grid-rows-2 md:grid-cols-8 md:w-1/2 w-full">
        <!-- Top-Left -->
        <div class="w-full md:col-span-5 md:px-3 md:pt-6 md:pb-3">
            <div class="rounded-2xl flex justify-center items-center bg-base-300 h-full w-full">
                <form class="w-11/12" use:enhance method="POST" action="?/addPassword">
                    <input name="password" class="input w-full" placeholder="Password">
                    <input name="maxuses" class="input w-full mt-2" placeholder="Max Uses" type="number" />
                    <button type="submit" class="w-full btn btn-primary mt-2">
                        Create Password
                    </button>
                </form>
            </div>
        </div>
        <!-- Top-Right -->
        <div class="w-full md:col-span-3 md:pl-3 md:pr-6 md:pt-6 md:pb-3">
            <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
            </div>
        </div>
        <!-- Bottom-Left -->
        <div class="w-full md:col-span-4 md:px-3 md:pt-3 md:pb-6 relative">
            <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
            </div>
        </div>
        <!-- Bottom-Right -->
        <div class="w-full md:col-span-4 md:pl-3 md:pr-6 md:pt-3 md:pb-6 relative">
            <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
            </div>
        </div>
    </div>
</div>