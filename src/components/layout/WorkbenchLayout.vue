<template>
  <div class="workbench-layout">
    <TopNavBar />
    <main class="content-area">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import TopNavBar from './TopNavBar.vue'
</script>

<style scoped>
.workbench-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-page);
}

.content-area {
  flex: 1;
  padding: 20px 24px 32px;
  overflow-x: hidden;
}
</style>
