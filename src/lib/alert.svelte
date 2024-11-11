<script lang="ts">
  import Icon from "@iconify/svelte";
  interface Alert {
    username: string;
    type: string;
    fail: boolean;
    message?: string;
  }

  interface Props {
    alert: Alert;
  }

  let { alert }: Props = $props();
  let self: HTMLElement = $state();
</script>

{#if alert.type === "delete"}
  {#if alert.fail === true}
    <div role="alert" class="alert alert-error relative my-2" bind:this={self}>
      <p class="text-error-content">
        Failed to delete {alert.username}
        {#if alert.message !== ""}({alert.message}){/if}
      </p>
      <button class="absolute right-2 top-1/2 -translate-y-1/2" onclick={() => self.remove()}>
        <Icon icon="mingcute:close-line" class="text-error-content" height="28" />
      </button>
    </div>
  {:else}
    <div role="alert" class="alert alert-success relative my-2" bind:this={self}>
      <p class="text-success-content">Successfully deleted {alert.username}</p>
      <button class="absolute right-2 top-1/2 -translate-y-1/2" onclick={() => self.remove()}>
        <Icon icon="mingcute:close-line" class="text-success-content" height="28" />
      </button>
    </div>
  {/if}
{:else if alert.type === "edit"}
  {#if alert.fail === true}
    <div role="alert" class="alert alert-error relative my-2" bind:this={self}>
      <p class="text-error-content">
        Failed to update {alert.username}
        {#if alert.message !== ""}({alert.message}){/if}
      </p>
      <button class="absolute right-2 top-1/2 -translate-y-1/2" onclick={() => self.remove()}>
        <Icon icon="mingcute:close-line" class="text-error-content" height="28" />
      </button>
    </div>
  {:else}
    <div role="alert" class="alert alert-success relative my-2" bind:this={self}>
      <p class="text-success-content">Successfully updated {alert.username}</p>
      <button class="absolute right-2 top-1/2 -translate-y-1/2" onclick={() => self.remove()}>
        <Icon icon="mingcute:close-line" class="text-success-content" height="28" />
      </button>
    </div>
  {/if}
{/if}
