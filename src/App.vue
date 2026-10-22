<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'

const route = useRoute()
const siteName = import.meta.env.VITE_SITE_NAME
const isHome = computed(() => route.path === '/')
</script>

<template>
  <header class="sticky top-0 z-10 border-b border-white/60 bg-white/60 backdrop-blur-md">
    <div class="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
      <router-link to="/" class="flex shrink-0 items-center gap-2 font-bold">
        <i class="bx bx-buildings text-2xl text-primary"></i>
        <span class="hidden sm:inline font-title">{{ siteName }}</span>
      </router-link>
      <SearchBar v-if="!isHome" compact />
    </div>
  </header>
  <main class="mx-auto max-w-4xl px-4 py-8">
    <router-view />
  </main>
  <footer class="py-8 text-center text-xs text-gray-400">
    資料來源：<a class="underline" href="https://company.g0v.ronny.tw" target="_blank" rel="noopener">g0v 台灣公司資料</a>
  </footer>
</template>
