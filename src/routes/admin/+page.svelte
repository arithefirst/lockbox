<script lang="ts">
    // Imports
    import DataTable from "\$lib/data-table.svelte";
    import Icon from "@iconify/svelte";
    import {page} from "$app/stores";
    import {enhance} from "$app/forms";
    import type { ActionData } from "./$types";

    // Variables
    export let form: ActionData;
    let refresh: boolean = false;
    let userError: boolean = false
    let username = fetchUsername()
    let userApiData = fetchUsers()

    // Functions
    async function fetchUsers() {
        const response = await fetch("/api/users")
        const json = await response.json()
        if (json["error"] !== null) {
            userError = true
            return null
        }

        userError = false
        return json["data"]
    }

    async function fetchUsername() {
        const response = await fetch("/api/getCurrentUser")
        const json = await response.json()
        return json["username"]
    }

    // Reactive Blocks
    $: message = form?.message || '';
    $: if (message === "Success") {
        refresh = true;
    }
</script>

<head>
    <title>Lockbox Admin</title>
</head>

<div class="w-screen h-screen relative md:flex">
    <div class="w-full md:w-1/2 h-screen md:pl-6 md:py-6 md:pr-3 relative">
        <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
            <DataTable bind:refresh={refresh}/>
        </div>
    </div>
    <div class="md:grid h-full grid-rows-2 md:grid-cols-8 md:w-1/2 w-full">
        <!-- Top-Left -->
        <div class="w-full md:col-span-5 md:px-3 md:pt-6 md:pb-3">
            <div class="rounded-2xl flex justify-center items-center bg-base-300 h-full w-full">
                <form class="w-11/12" use:enhance method="POST" action="?/addPassword">
                    <input required name="password" class="input w-full" placeholder="Password">
                    <input required name="maxuses" class="input w-full mt-2" placeholder="Max Uses" type="number" />
                    <button type="submit" class="w-full btn btn-primary mt-2">
                        Add Password
                    </button>
                    {#if $page.status === 400 && form?.form === "newPassword"}
                        <p class="mt-2 text-error text-center">{message}</p>
                    {:else if message === "Success" && form?.form === "newPassword"}
                        <p class="mt-2 text-success text-center">Successfully added password "{form?.password}"</p>
                    {/if}
                </form>
            </div>
        </div>
        <!-- Top-Right -->
        <div class="w-full md:col-span-3 md:pl-3 md:pr-6 md:pt-6 md:pb-3">
            <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll flex justify-center items-center flex-col">
                {#await username then username}
                    <div class="avatar placeholder">
                        <div class="bg-neutral text-neutral-content w-32 rounded-full">
                            <span class="text-5xl">{username.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                    <h1 class="text-2xl mt-2 text-center w-full">Welcome, {username}</h1>
                {/await}
                <form use:enhance method="POST" action="?/logout">
                    <button type="submit" class="btn btn-error btn-sm mt-2">Log Out</button>
                </form>
            </div>
        </div>
        <!-- Bottom-Left -->
        <div class="w-full md:col-span-3 md:px-3 md:pt-3 md:pb-6">
            <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
                <div class="rounded-2xl flex justify-center items-center bg-base-300 h-full w-full">
                    <form class="w-11/12" use:enhance method="POST" action="?/addUser">
                        <input required name="username" class="input w-full" placeholder="Username">
                        <input required name="password" class="input w-full mt-2" placeholder="Password" type="password" />
                        <button type="submit" class="w-full btn btn-primary mt-2">
                            Add Admin
                        </button>
                        {#if $page.status === 400 && form?.form === "newUser"}
                            <p class="mt-2 text-error text-center">{message}</p>
                        {:else if message === "Success" && form?.form === "newUser"}
                            <p class="mt-2 text-success text-center">Successfully added user "{form?.user}"</p>
                        {/if}
                    </form>
                </div>
            </div>
        </div>
        <!-- Bottom-Right -->
        <div class="w-full md:col-span-5 md:pl-3 md:pr-6 md:pt-3 md:pb-6 relative">
            <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
                <table class="table table-zebra">
                    <thead>
                        <tr class="border-primary">
                            <th class="text-center text-base-content">Username</th>
                            <th class="text-center text-base-content">Edit</th>
                            <th class="text-center text-base-content">Delete</th>
                        </tr>
                    </thead>
                    {#await userApiData then users}
                        {#if !userError}
                            <tbody>
                                {#each users as username}
                                    <tr>
                                        <td class="text-center">{username}</td>
                                        <td><Icon icon="mingcute:user-edit-fill" height="18px" class="text-white cursor-pointer mx-auto"></Icon></td>
                                        <td><Icon icon="mingcute:delete-2-fill" height="18px" class="text-error cursor-pointer mx-auto"></Icon></td>
                                    </tr>
                                {/each}
                            </tbody>
                        {/if}
                    {/await}
                </table>
            </div>
        </div>
    </div>
</div>