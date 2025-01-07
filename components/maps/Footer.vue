<template>
  <div>
    <!-- Контейнер для карты -->
    <div ref="mapContainer" id="map"></div>
    <!-- Здесь будет показываться информация о месте -->
    <div id="infowindow-content">
      <span id="place-name" class="title" style="font-weight: bold"></span
      ><br />
      <span id="place-address"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";

// Функция для загрузки скриптов и подключений
const loadScript = (src: string, type: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement(
      type === "script" ? "script" : "link",
    );
    if (type === "script") {
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    } else if (type === "style") {
      script.rel = "stylesheet";
      script.href = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    }
  });
};

// ref для контейнера карты
const mapContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  // Загружаем необходимые скрипты
  loadScript(
    `https://unpkg.com/@googlemaps/extended-component-library@0.6`,
    "script",
  )
    .then(() => {
      return loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY || "AIzaSyCqfYBHSSatxDzAt9kU3IFFVyTk2BmaZzI"}&libraries=places,marker&v=beta`,
        "script",
      );
    })
    .then(() => {
      // Создаем кастомный элемент карты
      const mapElement = document.createElement("gmp-map");
      mapElement.setAttribute("center", "40.749933,-73.98633");
      mapElement.setAttribute("zoom", "13");
      mapElement.setAttribute("map-id", "DEMO_MAP_ID");

      // Вставляем карту в DOM через ref
      if (mapContainer.value) {
        mapContainer.value.appendChild(mapElement);
      }

      // Создаем маркер и добавляем его на карту
      const marker = document.createElement("gmp-advanced-marker");
      marker.setAttribute("id", "marker");
      mapElement.appendChild(marker);

      // Создаем place picker для поиска
      const placePicker = document.createElement("gmpx-place-picker");
      placePicker.setAttribute("id", "place-picker");
      placePicker.setAttribute("for-map", "map");

      // Вставляем элемент поиска в карту
      mapElement.appendChild(placePicker);

      // Добавляем обработчик изменения местоположения в place picker
      placePicker.addEventListener("gmpx-placechange", () => {
        const place = placePicker.value;

        if (!place.location) {
          alert("No details available for input: '" + place.name + "'");
          marker.position = null;
          return;
        }

        if (place.viewport) {
          mapElement.innerMap.fitBounds(place.viewport);
        } else {
          mapElement.center = place.location;
          mapElement.zoom = 17;
        }

        // Обновляем маркер и информационное окно
        marker.position = place.location;
        document.getElementById("place-name")!.textContent = place.displayName;
        document.getElementById("place-address")!.textContent =
          place.formattedAddress;
        const infowindow = new google.maps.InfoWindow({
          content: document.getElementById("infowindow-content")!,
        });
        infowindow.open(mapElement.innerMap, marker);
      });

      // Настройка фильтров поиска
      function setupClickListener(id: string, type: string) {
        const radioButton = document.getElementById(id);
        radioButton?.addEventListener("click", () => {
          placePicker.type = type;
        });
      }
      setupClickListener("changetype-all", "");
      setupClickListener("changetype-address", "address");
      setupClickListener("changetype-establishment", "establishment");
      setupClickListener("changetype-geocode", "geocode");
      setupClickListener("changetype-cities", "(cities)");
      setupClickListener("changetype-regions", "(regions)");

      // Включаем ограничение поиска в пределах карты
      const strictBoundsInputElement = document.getElementById(
        "use-strict-bounds",
      ) as HTMLInputElement;
      strictBoundsInputElement.addEventListener("change", () => {
        placePicker.strictBounds = strictBoundsInputElement.checked;
      });
    })
    .catch((error) => {
      console.error("Ошибка при загрузке скриптов:", error);
    });
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 300px;
  border-radius: 8px;
}
.pac-card {
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.3);
  margin: 10px;
  font:
    400 18px Roboto,
    Arial,
    sans-serif;
  overflow: hidden;
}
.pac-controls {
  display: inline-block;
  padding: 5px 11px;
}
.pac-controls label {
  font-size: 13px;
  font-weight: 300;
}
#place-picker {
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem 1rem 1rem;
}
</style>
