<script lang="ts">
  let input: HTMLInputElement;
  let password: string;
  let response: string;
  let uploading: boolean | null = null;

  interface postError {
    message: string;
  }
  let error: postError | null = null;

  async function uploadFile(file: File) {
    // If the file has no mimetype, treat it like a binary
    if (file.type === "") {
      file = new File([file], file.name, { type: "application/octet-stream" });
    }

    uploading = true;
    const res = await fetch(`/api/upload/${file.name}?pw=${password}`, {
      method: "POST",
      body: file,
    });

    if (res.ok) {
      await res.json().then((json) => {
        response = json["filename"];
        uploading = false;
      });
    } else {
      uploading = null;
      error = await res.json();
      console.log(error);
    }
  }

  function submit() {
    if (!input.files || input.files.length === 0) return;
    uploadFile(input.files[0]);
  }
</script>

<head>
  <title>Lockbox</title>
</head>

<div class="absolute top-1/2 left-1/2 -translate-x-1/2 w-11/12 md:w-fit -translate-y-1/2 flex-col justify-center">
  <form class="mx-auto">
    <input
      bind:value={password}
      required
      type="password"
      name="password"
      placeholder="Password"
      class="input input-bordered mb-2 w-full md:max-w-xs"
    /><br />
    <input bind:this={input} multiple={false} required type="file" name="file" class="file-input file-input-bordered w-full md:max-w-xs" /><br />
    <button class="btn-block btn-primary btn md:max-w-xs mt-2" type="submit" on:click={submit}>Submit</button><br />
  </form>
</div>

<div class="w-full fixed bottom-8">
  {#if uploading === true}
    <p class="text-warning mt-2 text-center w-full">Uploading File. Please do not close page.</p>
  {:else if uploading === false}
    <p class="text-success mt-2 text-center w-full">{response} successfully uploaded.</p>
  {:else if error != null}
    <p class="text-error mt-2 text-center w-full">Error: {error["message"]}</p>
  {/if}
</div>