<template>
  <div class="mb-4">
    <label class="form-label">{{ $t("products.filterByType") }}</label>
    <select v-model="internalValue" class="form-select w-auto">
      <option value="">{{ $t("products.allTypes") }}</option>
      <option v-for="type in types" :key="type" :value="type">
        {{ type }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useInventoryStore } from "~/stores/inventory";

// Объявление пропсов
const props = defineProps<{
  modelValue: string;
  types: string[];
}>();

// Объявление события
const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

// Использование computed вместо ref для сохранения реактивности
const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
    useInventoryStore().setSelectedProductType(value);
  },
});
</script>
