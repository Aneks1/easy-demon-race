<template>
  <div class="ivy-box">
    <slot/>
  </div>
</template>

<style scoped>
.ivy-box {
  background-color: var(--base-color-1);
  border: 1px solid var(--accent-color-2);
  color: var(--accent-color-1);
  padding: 1rem;
  box-sizing: border-box;
  font-size: 1rem;
  border-radius: 0.5rem;
}
</style>