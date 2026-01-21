<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'error', // error, warning, info
    validator: (value) => ['error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const visible = ref(!!props.message)

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    visible.value = true
    setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
})
</script>

<template>
  <transition name="slide-down">
    <div v-if="visible && message" class="error-notification" :class="`type-${type}`">
      <span class="icon">{{ type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️' }}</span>
      <span class="message">{{ message }}</span>
      <button class="close-btn" @click="visible = false">×</button>
    </div>
  </transition>
</template>

<style scoped>
.error-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  max-width: 400px;
}

.type-error {
  border-left: 4px solid #e94560;
}

.type-warning {
  border-left: 4px solid #f39c12;
}

.type-info {
  border-left: 4px solid #4a90e2;
}

.icon {
  font-size: 1.2rem;
}

.message {
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
