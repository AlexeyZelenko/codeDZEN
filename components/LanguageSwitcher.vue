<template>
  <div class="language-switcher">
    <button
        v-for="locale in availableLocales"
        :key="locale.code"
        @click="switchLanguage(locale.code)"
        class="language-switcher__button"
        :class="{ active: currentLocale === locale.code }"
    >
      {{ locale.name }}
    </button>
  </div>
</template>


<script setup lang="ts">
const { locale } = useI18n()

const currentLocale = computed(() => locale.value)
const availableLocales = [
  { code: 'en', name: 'EN' },
  { code: 'uk', name: 'UA' }
]

const switchLanguage = (code: string) => {
  locale.value = code
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.language-switcher__button {
  background: transparent;
  border: 1px solid #cccccc;
  color: #333333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-weight: 500;
  text-transform: uppercase;
}

.language-switcher__button.active {
  background: #4caf50; /* Зеленый цвет для активного языка */
  color: white;
  border-color: #4caf50;
}

.language-switcher__button:hover {
  background: #f0f0f0;
  color: #111827;
}

.language-switcher__button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>

