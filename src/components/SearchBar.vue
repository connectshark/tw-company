<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SEARCH_TYPES, searchLink } from '@/utils/company'

defineProps({
  compact: { type: Boolean, default: false }
})

const route = useRoute()
const router = useRouter()
const keyword = ref('')
const type = ref('search')

// 在人名、法人結果頁時，搜尋類型跟著目前頁面
watch(
  () => route.path,
  (path) => {
    type.value = Object.keys(SEARCH_TYPES).find((t) => path.startsWith(`/${t}/`)) ?? 'search'
  },
  { immediate: true }
)

const placeholder = computed(() => SEARCH_TYPES[type.value].placeholder)

const submit = () => {
  const q = keyword.value.trim()
  if (!q) return
  // 8 碼數字一律視為統一編號
  router.push(/^\d{8}$/.test(q) ? `/id/${q}` : searchLink(type.value, q))
}
</script>

<template>
  <form
    class="flex w-full items-center gap-2 rounded-full border border-white/60 bg-white/70 shadow-sm backdrop-blur-md focus-within:ring-2 focus-within:ring-primary/50"
    :class="compact ? 'max-w-md px-3 py-1.5' : 'max-w-xl px-5 py-3'"
    @submit.prevent="submit"
  >
    <select
      v-model="type"
      aria-label="搜尋類型"
      class="shrink-0 cursor-pointer bg-transparent font-bold text-primary outline-none"
      :class="compact ? 'text-sm' : ''"
    >
      <option v-for="(t, key) in SEARCH_TYPES" :key="key" :value="key">{{ t.label }}</option>
    </select>
    <span class="h-5 w-px shrink-0 bg-gray-200"></span>
    <input
      v-model="keyword"
      type="search"
      class="w-full min-w-0 bg-transparent outline-none placeholder:text-gray-400"
      :class="compact ? 'text-sm' : 'text-lg'"
      :placeholder="placeholder"
    />
    <button
      type="submit"
      class="shrink-0 rounded-full bg-primary font-bold text-white transition hover:brightness-95"
      :class="compact ? 'px-3 py-1 text-sm' : 'px-5 py-2'"
    >搜尋</button>
  </form>
</template>
