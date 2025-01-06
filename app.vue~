<script setup lang="ts">
import { useIsLoadingStore } from '~/stores/inventory'

const isLoadingStore = useIsLoadingStore()
</script>

<template>
  <div class="app">
    <TopMenu class="app__nav"/>
    <div class="app__container">
      <NavigationMenu />
      <Loader v-if="isLoadingStore.isLoading"/>
      <main v-show="!isLoadingStore.isLoading" class="app__content">
        <NuxtPage />
      </main>
    </div>
    <BottomMenu />
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background: #F9FAFB;
}

.app__nav {
  position: static;
}

.app__container {
  display: flex;
  min-height: calc(100vh - 4rem);
}

.app__content {
  flex: 1;
  padding: 2rem;
  margin-left: 200px;
  margin-top: 58px;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 100px;
  }
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: #111827;
  background: #F9FAFB;
}
</style>