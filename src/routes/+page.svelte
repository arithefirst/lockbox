<script lang="ts">
    import {enhance} from "$app/forms";
    import {page} from "$app/stores";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let wrongPassword: boolean = false;
    $: success = form?.success || false
    $: if ($page.status === 401) {
        console.error("Invalid password entered.")
        wrongPassword = true;
    }
</script>

<head>
    <title>Lockbox</title>
</head>

<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <form method="post" use:enhance enctype="multipart/form-data" class="w-11/12 md:w-fit">
        <input required type="password" name="password" placeholder="Password" class="input input-bordered mb-2 w-full md:max-w-xs" /><br>
        <input required type="file" name="file" class="file-input file-input-bordered w-full md:max-w-xs"/><br>
        <button class="btn-block btn-primary btn md:max-w-xs mt-2" type="submit">Submit</button><br>
    </form>
    <div class="relative">
        {#if wrongPassword}
            <p class="mt-2 text-error text-center">Invalid Password</p>
        {:else if success}
            <p class="mt-2 text-success text-center absolute left-1/2 -translate-x-1/2 w-[24rem]">{form?.filename} submitted successfully</p>
        {/if}
    </div>
</div>
