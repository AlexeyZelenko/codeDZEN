<template>
  <nav :class="['side-nav', { 'side-nav--open': isOpen }]">
    <div class="side-nav__user">
      <svg class="side-nav__toggle bi bi-x-lg" @click="toggleMenu" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
      </svg>
      <img :src="userAvatar" alt="User avatar" class="side-nav__avatar" />
    </div>
    <ul v-if="menuItems.length" class="side-nav__menu">
      <li v-for="item in menuItems" :key="item.path">
        <NuxtLink
            :to="item.path"
            class="side-nav__link"
            :class="{ 'side-nav__link--active': isActive(item.path) }"
            :aria-current="isActive(item.path) ? 'page' : null"
        >
          <span class="side-nav__icon">
            <svg
                v-if="item.icon"
                :xmlns="item.icon.xmlns"
                :viewBox="item.icon.viewBox"
                fill="currentColor"
                class="bi bi-icon"
            >
              <path :d="item.icon.path" />
            </svg>
          </span>
          <span>{{ $t(item.label) }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {useInventoryStore} from '~/stores/inventory'

const userAvatar = ref('/default-avatar.png');

const store = useInventoryStore();
const isOpen = computed(() => store.isOpenMenu);
const toggleMenu = () => {
  store.toggleMenu();
};
const menuItems = [
  {
    label: 'sideNav.products',
    path: '/products',
    icon: {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 16 16',
      path: 'M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0z',
    },
  },
  {
    label: 'sideNav.orders',
    path: '/orders',
    icon: {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 16 16',
      path: 'M1 2.828v10.344A2 2 0 0 0 3 15h10a2 2 0 0 0 2-1.828V2.828A2 2 0 0 0 13 1H3a2 2 0 0 0-2 1.828z',
    },
  },
  {
    label: 'location',
    path: '/location',
    icon: {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 16 16',
      path: 'M1 2.828v10.344A2 2 0 0 0 3 15h10a2 2 0 0 0 2-1.828V2.828A2 2 0 0 0 13 1H3a2 2 0 0 0-2 1.828z',
    },
  },
];

const route = useRoute();
const isActive = (path: string) => route.path.startsWith(path);
</script>

<style scoped>
html,
body {
  height: 100%; /* Убедитесь, что html и body занимают всю высоту */
  margin: 0;
  overflow: hidden; /* Скрывает прокрутку для основного контента при открытом меню */
}
.side-nav {
  width: 200px;
  margin-top: 58px;
  background: white;
  border-right: 1px solid #e5e7eb;
  height: 100%;
  position: fixed;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 1000;
}

.side-nav--open {
  transform: translateX(0);
}

.side-nav__user {
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.side-nav__avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
  margin: 10px 0;
}

.side-nav__menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.side-nav__link {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
  font-weight: 500;
}

.side-nav__link:hover {
  background: #f3f4f6;
  color: #111827;
}

.side-nav__link--active {
  background: #4caf50;
  color: white;
}

.side-nav__icon {
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .side-nav {
    margin-top: 91px;
    transform: translateX(-100%);
    width: 100%;
    height: auto;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    background: white;
    padding: 0;
  }

  .side-nav--open {
    transform: translateX(0);
  }

  .side-nav__user[data-v-4ca49a75] {
    margin-bottom: 0.5rem;
  }
}

@media (min-width: 768px) {
  .side-nav__toggle {
    display: none;
  }
}
</style>
