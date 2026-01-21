<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium' // small, medium, large
  },
  color: {
    type: String,
    default: '#4a90e2'
  }
})
</script>

<template>
  <div class="spinner-container" :class="`size-${size}`">
    <div class="spinner" :style="{ borderTopColor: color }"></div>
  </div>
</template>

<style scoped>
.spinner-container {
  display: inline-block;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #4a90e2;
  animation: spin 0.8s linear infinite;
}

.size-small .spinner {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.size-medium .spinner {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.size-large .spinner {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
