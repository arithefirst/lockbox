<script lang="ts">
  // Imports
  import DataTable from "$lib/data-table.svelte";
  import Alert from "$lib/alert.svelte";
  import Icon from "@iconify/svelte";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  // Types
  interface alert {
    username: string;
    type: string;
    fail: boolean;
    message?: string;
  }

  // Variables
  export let form: ActionData;
  let userError: boolean = false;
  let username = fetchUsername();
  let userApiData = fetchUsers();
  let alerts: alert[] = [];

  // Functions
  async function fetchUsers() {
    const response = await fetch("/api/users");
    const json = await response.json();
    if (json["error"] !== null) {
      userError = true;
      return null;
    }

    userError = false;
    return json["data"];
  }

  async function fetchUsername() {
    const response = await fetch("/api/getCurrentUser");
    const json = await response.json();
    return json["username"];
  }

  function openModal(username: string, type: string) {
    if (type === "delete" || type === "edit") {
      eval(`${type}_modal_${username}.showModal()`);
      let input = document.getElementById(`${type}_${username}_input`)! as HTMLInputElement;
      if (input.value === "") {
        input.value = username;
      }
    }
  }

  function tryCloseEditModal(username: string) {
    const field = document.getElementById(`edit_${username}_pw`) as HTMLInputElement;
    if (field.value !== "") {
      eval(`edit_modal_${username}.close()`);
    }
  }

  // Reactive Blocks
  $: message = form?.message || "";

  $: if (form?.form === "delete" || form?.form === "edit") {
    alerts.push({
      type: form?.form,
      username: form?.user!,
      fail: !form?.success!,
      message: form?.message!,
    });

    // Reassign variable to make the #each statement reactive
    alerts = alerts;
  }
</script>

<head>
  <title>Lockbox Admin</title>
</head>

<div class="w-screen h-screen relative md:flex">
  <div class="w-full md:w-1/2 h-screen md:pl-6 md:py-6 md:pr-3 relative">
    <div class="w-full h-full rounded-2xl bg-base-300 overflow-x-scroll">
      <DataTable {form} />
    </div>
  </div>
  <div class="md:grid h-full grid-rows-2 md:grid-cols-8 md:w-1/2 w-full">
    <!-- Top-Left -->
    <div class="w-full md:col-span-5 md:px-3 md:pt-6 md:pb-3">
      <div class="rounded-2xl flex justify-center items-center bg-base-300 h-full w-full">
        <form class="w-11/12" use:enhance method="POST" action="?/addPassword">
          <input required name="password" class="input w-full" placeholder="Password" />
          <input required name="maxuses" class="input w-full mt-2" placeholder="Max Uses" type="number" />
          <button type="submit" class="w-full btn btn-primary mt-2"> Add Password </button>
          {#if $page.status === 400 && form?.form === "newPassword"}
            <p class="mt-2 text-error text-center">{message}</p>
          {:else if message === "Success" && form?.form === "newPassword"}
            <p class="mt-2 text-success text-center">
              Successfully added password "{form?.password}"
            </p>
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
            <input required name="username" class="input w-full" placeholder="Username" />
            <input required name="password" class="input w-full mt-2" placeholder="Password" type="password" />
            <button type="submit" class="w-full btn btn-primary mt-2"> Add Admin </button>
            {#if $page.status === 400 && form?.form === "newUser"}
              <p class="mt-2 text-error text-center">{message}</p>
            {:else if message === "Success" && form?.form === "newUser"}
              <p class="mt-2 text-success text-center">
                Successfully added user "{form?.user}"
              </p>
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
                    <td class="text-center">
                      <dialog id="edit_modal_{username}" class="modal modal-bottom sm:modal-middle">
                        <div class="modal-box">
                          <h3 class="text-lg font-bold">Edit {username}</h3>
                          <div class="modal-action">
                            <form use:enhance method="POST" action="?/edit" class="grid grid-cols-1 mx-auto">
                              <input id="edit_{username}_input" name="currentUsername" class="hidden" value={username} />
                              <input name="newUsername" type="text" placeholder="New Username" class="input input-bordered" />
                              <input name="newPassword" type="password" placeholder="New Password" class="input mt-2 input-bordered" />
                              <input
                                id="edit_{username}_pw"
                                required
                                name="currentPassword"
                                type="password"
                                placeholder="Current Password"
                                class="input mt-2 input-bordered"
                              />
                              <button class="mt-2 btn btn-primary" on:click={() => tryCloseEditModal(username)}>Update User</button>
                              <p class="w-11/12 mx-auto text-center mt-1">
                                One or both of "New Username" and "New Password" Fields must be filled out.
                              </p>
                            </form>
                          </div>
                        </div>
                      </dialog>
                      <button on:click={() => openModal(username, "edit")}>
                        <Icon icon="mingcute:user-edit-fill" height="18px" class="text-white" />
                      </button>
                    </td>
                    <td class="text-center">
                      <dialog id="delete_modal_{username}" class="modal modal-bottom sm:modal-middle">
                        <div class="modal-box">
                          <h3 class="text-lg font-bold">
                            Are you sure you want to delete {username}?
                          </h3>
                          <form use:enhance method="POST" action="?/delete">
                            <input id="delete_{username}_input" name="username" class="hidden" value={username} />
                            <button class="mt-2 btn btn-error" on:click={() => eval(`delete_modal_${username}.close()`)}>Delete User</button>
                          </form>
                        </div>
                      </dialog>
                      <button on:click={() => openModal(username, "delete")}>
                        <Icon icon="mingcute:delete-2-fill" height="18px" class="text-error" />
                      </button>
                    </td>
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

<!-- Alerts -->
<div class="fixed right-2 bottom-0 w-1/3">
  {#if alerts.length > 0}
    {#each alerts as alert}
      <Alert {alert}></Alert>
    {/each}
  {/if}
</div>
