<template>
  <div class="photo-upload">
    <div class="mb-3">
      <label class="form-label">{{ $t('products.photo') }}</label>
      <div class="d-flex gap-3 align-items-start">
        <div class="flex-grow-1">
          <input
              ref="fileInput"
              type="file"
              class="form-control"
              accept="image/*"
              @change="handleFileChange"
          />
          <div v-if="error" class="text-danger mt-1 small">
            {{ error }}
          </div>
        </div>
        <div v-if="modelValue" class="preview-container">
          <img
              :src="modelValue"
              alt="Preview"
              class="preview-image"
          />
        </div>
      </div>
    </div>

    <div v-if="uploading" class="progress mt-2">
      <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: `${progress}%` }"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
      >
        {{ progress }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFileUpload } from '~/composables/useFileUpload'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const { uploading, error, progress, uploadFile } = useFileUpload()

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  try {
    const url = await uploadFile(file)
    emit('update:modelValue', url)
  } catch {
    console.log('Error uploading file')
  } finally {
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>

<style scoped>
.preview-container {
  width: 100px;
}

.preview-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}
</style>