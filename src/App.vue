<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#1677FF',
        borderRadius: 8,
        fontFamily: 'PingFang SC, Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      },
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
</script>
