<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, required: true },
  total: { type: Number, required: true }
})

// 顯示目前頁前後各 2 頁，頭尾固定顯示，中間斷開的地方用 … 表示
const items = computed(() => {
  const { page, total } = props
  const pages = new Set([1, total])
  for (let p = page - 2; p <= page + 2; p++) {
    if (p >= 1 && p <= total) pages.add(p)
  }
  const sorted = [...pages].sort((a, b) => a - b)
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['…', p] : [p]))
})

const linkTo = (p) => ({ query: { page: p } })
const base = 'inline-flex min-w-9 items-center justify-center rounded-full px-3 py-1.5 text-sm tabular-nums transition'
</script>

<template>
  <nav v-if="total > 1" class="flex flex-wrap items-center justify-center gap-1.5">
    <router-link v-if="page > 1" :to="linkTo(page - 1)" :class="[base, 'bg-white/70 hover:bg-white']">
      <i class="bx bx-chevron-left"></i>
    </router-link>

    <template v-for="(item, i) in items" :key="i">
      <span v-if="item === '…'" class="px-1 text-gray-400">…</span>
      <span v-else-if="item === page" :class="[base, 'bg-primary font-bold text-white']">{{ item }}</span>
      <router-link v-else :to="linkTo(item)" :class="[base, 'bg-white/70 hover:bg-white']">{{ item }}</router-link>
    </template>

    <router-link v-if="page < total" :to="linkTo(page + 1)" :class="[base, 'bg-white/70 hover:bg-white']">
      <i class="bx bx-chevron-right"></i>
    </router-link>
  </nav>
</template>
