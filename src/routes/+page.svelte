<script lang="ts">
    import {enhance} from "$app/forms";
    import {page} from "$app/stores";
    let wrongPassword: boolean = false;
    $: if ($page.status === 401) {
        console.error("Invalid password entered.")
        wrongPassword = true;
    }

</script>

<form method="post" use:enhance enctype="multipart/form-data" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-fit">
    <input required type="password" name="password" placeholder="password" class="input input-bordered mb-2 w-full md:max-w-xs" /><br>
    <input required type="file" name="file" class="file-input file-input-bordered w-full md:max-w-xs"/><br>
    <button class="btn-block btn-primary btn md:max-w-xs mt-2" type="submit">Submit</button><br>
    {#if wrongPassword}
        <p class="text-error text-center">Invalid Password</p>
    {/if}
</form>

