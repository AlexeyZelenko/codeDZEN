<template>
  <div class="mb-4">
    <label class="form-label">{{ $t('products.filterByType') }}</label>
    <select
        v-model="internalValue"
        class="form-select w-auto"
    >
      <option value="">{{ $t('products.allTypes') }}</option>
      <option v-for="type in types" :key="type" :value="type">
        {{ type }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useInventoryStore } from '~/stores/inventory';

// Объявление пропсов
const props = defineProps<{
  modelValue: string;
  types: string[];
}>();

// Объявление события
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

// Подключение Pinia store
const inventoryStore = useInventoryStore();

// Локальное значение для v-model
const internalValue = ref(props.modelValue);

// Следим за изменением prop и обновляем локальное значение
watch(
    () => props.modelValue,
    (newValue) => {
      internalValue.value = newValue;
    }
);

watch(
    () => internalValue.value,
    (newValue) => {
      emit('update:modelValue', newValue);
      inventoryStore.setSelectedProductType(newValue); // Обновляем состояние в Pinia
    }
);
</script>
