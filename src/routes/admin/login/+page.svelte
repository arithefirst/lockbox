<script lang="ts">
    import {enhance} from "$app/forms";
    import {page} from "$app/stores";
    let wrongPassword: boolean = false

    $: wrongPassword = $page.status === 401;
</script>

<form method="post" use:enhance enctype="multipart/form-data" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-fit">
    <input required type="text" name="username" placeholder="username" class="input input-bordered mb-2 w-full md:max-w-xs" /><br>
    <input required type="password" name="password" placeholder="password" class="input input-bordered mb-2 w-full md:max-w-xs" />
    <button class="btn-block btn-primary btn md:max-w-xs mt-2" type="submit">Log in</button><br>
    {#if wrongPassword}
        <p class="text-error text-center">Invalid username or password</p>
    {/if}
</form>