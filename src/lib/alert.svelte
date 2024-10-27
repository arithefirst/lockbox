<script lang="ts">
  import Icon from "@iconify/svelte";
  interface Alert {
    username: string;
    type: string;
    fail: boolean;
  }

  export let alert: Alert;
  let self: HTMLElement;
</script>

{#if alert.type === "delete"}
  {#if alert.fail === true}
    <div role="alert" class="alert alert-error relative my-2" bind:this={self}>
      <p class="text-error-content">Failed to delete {alert.username}</p>
      <button class="absolute right-2 top-1/2 -translate-y-1/2" on:click={() => self.remove()}>
        <Icon icon="mingcute:close-line" class="text-error-content" height="28" />
      </button>
    </div>
  {:else}
    <div role="alert" class="alert alert-success relative my-2" bind:this={self}>
      <p class="text-success-content">Successfully deleted {alert.username}</p>
      <button class="absolute right-2 top-1/2 -translate-y-1/2" on:click={() => self.remove()}>
        <Icon icon="mingcute:close-line" class="text-success-content" height="28" />
      </button>
    </div>
  {/if}
{:else if alert.type === "edit"}
  {#if alert.fail === true}
    <div role="alert" class="alert alert-error relative my-2" bind:this={self}>
      <p class="text-error-content">Failed to update {alert.username}</p>
      <button class="absolute right-2 top-1/2 -translate-y-1/2" on:click={() => self.remove()}>
        <Icon icon="mingcute:close-line" class="text-error-content" height="28" />
      </button>
    </div>
  {:else}
    <div role="alert" class="alert alert-success relative my-2" bind:this={self}>
      <p class="text-success-content">Successfully updated {alert.username}</p>
      <button class="absolute right-2 top-1/2 -translate-y-1/2" on:click={() => self.remove()}>
        <Icon icon="mingcute:close-line" class="text-success-content" height="28" />
      </button>
    </div>
  {/if}
{/if}
