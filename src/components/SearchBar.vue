<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  compact: { type: Boolean, default: false }
})

const router = useRouter()
const keyword = ref('')

const submit = () => {
  const q = keyword.value.trim()
  if (!q) return
  router.push(/^\d{8}$/.test(q) ? `/id/${q}` : `/name/${encodeURIComponent(q)}`)
}
</script>

<template>
  <form
    class="flex w-full items-center gap-2 rounded-full border border-white/60 bg-white/70 shadow-sm backdrop-blur-md focus-within:ring-2 focus-within:ring-primary/50"
    :class="compact ? 'max-w-sm px-3 py-1.5' : 'max-w-xl px-5 py-3'"
    @submit.prevent="submit"
  >
    <i class="bx bx-search text-xl text-primary"></i>
    <input
      v-model="keyword"
      type="search"
      class="w-full bg-transparent outline-none placeholder:text-gray-400"
      :class="compact ? 'text-sm' : 'text-lg'"
      placeholder="輸入統一編號或公司名稱"
    />
    <button
      type="submit"
      class="shrink-0 rounded-full bg-primary font-bold text-white transition hover:brightness-95"
      :class="compact ? 'px-3 py-1 text-sm' : 'px-5 py-2'"
    >搜尋</button>
  </form>
</template>
