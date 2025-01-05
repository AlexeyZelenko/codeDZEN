<template>
  <div class="location-picker">
    <div class="search-container mb-3">
      <gmpx-api-loader :key=apiKey solution-channel="GMP_CCS_autocomplete_v4" ></gmpx-api-loader>
      <gmpx-place-picker
          id="place-picker"
          class="form-control"
          @gmpx-placechange="handlePlaceChange"
      ></gmpx-place-picker>
    </div>

    <div class="map-container">
      <gmp-map
          :center="mapCenter"
          :zoom="13"
          class="map"
          map-id="c1d0d5ecafe10f2e"
      >
        <gmp-advanced-marker
            v-if="selectedLocation"
            :position="selectedLocation"
        ></gmp-advanced-marker>
      </gmp-map>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useLocalStorage } from '~/composables/useLocalStorage'

// Получаем ключ API из переменных окружения
const apiKey = ref(process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCqfYBHSSatxDzAt9kU3IFFVyTk2BmaZzI')

interface Location {
  lat: number
  lng: number
}

const { getValue, setValue } = useLocalStorage()
const mapCenter = ref<Location>({ lat: 50.4501, lng: 30.5234 }) // По умолчанию Киев
const selectedLocation = ref<Location | null>(null)

onMounted(() => {
  const savedLocation = getValue<Location>('selectedLocation')
  if (savedLocation) {
    selectedLocation.value = savedLocation
    mapCenter.value = savedLocation
  }
})

const handlePlaceChange = (event: CustomEvent) => {
  const place = event.target.value

  if(!place) {
    return
  }
  selectedLocation.value = place.location
  mapCenter.value = place.location
  setValue('selectedLocation', place.location)
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
