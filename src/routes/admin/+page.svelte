<script lang="ts">
    import DataTable from "\$lib/data-table.svelte";
</script>

<div class="w-screen h-screen relative flex">
    <div class="w-full md:w-1/2 h-screen md:pl-6 md:py-6 md:pr-3 relative">
        <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
            <DataTable />
        </div>
    </div>
    <div class="grid grid-cols-2 w-1/2">
        <!-- Top-Left -->
        <div class="w-full md:px-3 md:pt-6 md:pb-3 relative">
            <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
            </div>
        </div>
        <!-- Top-Right -->
        <div class="w-full md:pl-3 md:pr-6 md:pt-6 md:pb-3 relative">
            <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
            </div>
        </div>
        <!-- Bottom-Left -->
        <div class="w-full md:px-3 md:pt-3 md:pb-6 relative">
            <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
            </div>
        </div>
        <!-- Bottom-Right -->
        <div class="w-full md:pl-3 md:pr-6 md:pt-3 md:pb-6 relative">
            <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
            </div>
        </div>
    </div>
</div>