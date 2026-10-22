<script setup>
import { isActive } from '@/utils/company'

defineProps({
  status: { type: String, default: '' }
})
</script>

<template>
  <span
    v-if="status"
    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
    :class="isActive(status) ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'"
  >
    <span class="size-1.5 rounded-full" :class="isActive(status) ? 'bg-emerald-500' : 'bg-gray-400'"></span>
    {{ status }}
  </span>
</template>
