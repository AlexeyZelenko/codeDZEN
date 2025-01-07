<template>
  <div class="location-picker">
    <GoogleMap
      :api-key="apiKey"
      style="width: 100%; height: 500px"
      :center="center"
      :zoom="4"
      mapTypeId="terrain"
    >
      <Marker :options="{ position: center }" />
      <Circle
        v-for="(circle, index) in circles"
        :key="index"
        :options="circle"
      />
    </GoogleMap>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GoogleMap, Marker, Circle } from "vue3-google-map";

// Центр карти (наприклад, Нью-Йорк)
const center = { lat: 37.09, lng: -95.712 };

const cities = {
  chicago: {
    center: { lat: 41.878, lng: -87.629 },
    population: 2714856,
  },
  newyork: {
    center: { lat: 40.714, lng: -74.005 },
    population: 8405837,
  },
  losangeles: {
    center: { lat: 34.052, lng: -118.243 },
    population: 3857799,
  },
  vancouver: {
    center: { lat: 49.25, lng: -123.1 },
    population: 603502,
  },
};

const circles = Object.keys(cities).map((key) => ({
  center: cities[key].center,
  radius: Math.sqrt(cities[key].population) * 100,
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
}));

// Получаем ключ API из переменных окружения
const apiKey = ref(
  process.env.GOOGLE_MAPS_API_KEY || "AIzaSyCqfYBHSSatxDzAt9kU3IFFVyTk2BmaZzI",
);

interface Location {
  lat: number;
  lng: number;
}
</script>

<style scoped>
.location-picker {
  width: 100%;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
}

gmpx-place-picker {
  width: 100%;
}
</style>
