<script setup>
import { computed } from 'vue'
import { summarize, formatDate } from '@/utils/company'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  company: { type: Object, required: true }
})

const info = computed(() => summarize(props.company))
const id = computed(() => props.company['統一編號'])
</script>

<template>
  <router-link
    :to="`/id/${id}`"
    class="block rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-lg"
  >
    <div class="flex flex-wrap items-center gap-2">
      <h2 class="text-lg font-bold">{{ info.name }}</h2>
      <StatusBadge :status="info.status" />
    </div>
    <p class="mt-1 text-sm text-gray-500 tabular-nums">統一編號 {{ id }}</p>
    <dl class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
      <div v-if="info.owner" class="flex gap-2"><dt class="text-gray-500">負責人</dt><dd>{{ info.owner }}</dd></div>
      <div v-if="info.capital" class="flex gap-2"><dt class="text-gray-500">資本額</dt><dd class="tabular-nums">{{ info.capital }} 元</dd></div>
      <div v-if="info.founded" class="flex gap-2"><dt class="text-gray-500">設立</dt><dd class="tabular-nums">{{ formatDate(info.founded) }}</dd></div>
      <div v-if="info.org" class="flex gap-2"><dt class="text-gray-500">組織</dt><dd>{{ info.org }}</dd></div>
      <div v-if="info.address" class="flex gap-2 sm:col-span-2"><dt class="shrink-0 text-gray-500">地址</dt><dd>{{ info.address }}</dd></div>
    </dl>
  </router-link>
</template>
