<template>
  <header class="top-menu">
    <button class="top-menu__toggle" @click="toggleMenu">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        class="bi bi-list"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M2.5 12.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0-5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0-5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11z"
        />
      </svg>
    </button>
    <div class="top-menu__left">
      <CurrentDateTime />
    </div>
    <LanguageSwitcher />
    <div class="top-menu__right">
      <ActiveSessionsCounter />
    </div>
  </header>
</template>

<script setup lang="ts">
import CurrentDateTime from "./CurrentDateTime.vue";
import ActiveSessionsCounter from "./ActiveSessionsCounter.vue";
import { useInventoryStore } from "~/stores/inventory";

const store = useInventoryStore();
const isOpen = computed(() => store.isOpenMenu);

const toggleMenu = () => {
  store.toggleMenu();
};
</script>

<style scoped>
.top-menu {
  width: 100%;
  display: flex;
  position: fixed;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  border-bottom: 1px solid #dee2e6;
  z-index: 1001;
}

.top-menu__left,
.top-menu__right {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin: 0 10px;
}

.top-menu__toggle {
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.top-menu__toggle:hover {
  color: #111827;
}

@media (min-width: 768px) {
  .top-menu__toggle {
    display: none;
  }
}
</style>
