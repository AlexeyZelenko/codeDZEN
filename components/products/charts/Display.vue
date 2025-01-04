<template>
  <div class="chart-container">
    <canvas :id="chartId"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  chartId: {
    type: String,
    required: true,
  },
  chartType: {
    type: String,
    required: true,
  },
  labels: {
    type: Array as () => string[],
    required: true,
  },
  data: {
    type: Array as () => number[],
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  backgroundColors: {
    type: Array as () => string[],
    default: () => [],
  },
  borderColors: {
    type: Array as () => string[],
    default: () => [],
  },
});

const chartInstance = ref<Chart | null>(null);

const truncateLabel = (label: string, maxLength: number = 10): string => {
  return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
};

const initializeChart = () => {
  if (chartInstance.value) chartInstance.value.destroy();

  // Обрабатываем метки (обрезаем названия)
  const truncatedLabels = props.labels.map((label) => truncateLabel(label));

  chartInstance.value = new Chart(props.chartId, {
    type: props.chartType,
    data: {
      labels: truncatedLabels, // Используем обрезанные названия
      datasets: [
        {
          data: props.data,
          backgroundColor: props.backgroundColors,
          borderColor: props.borderColors,
          borderWidth: 1,
        },
      ],
    },
    options: props.options,
  });
};

onMounted(initializeChart);

watch([() => props.labels, () => props.data], initializeChart);
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
}
canvas {
  max-width: 100%;
}
</style>
