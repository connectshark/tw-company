<script setup>
import SearchBar from '@/components/SearchBar.vue'

const siteName = import.meta.env.VITE_SITE_NAME
</script>

<template>
<section class="flex flex-col items-center gap-6 pt-16 text-center sm:pt-24">
  <i class="bx bx-buildings text-6xl text-primary"></i>
  <h1 class="text-3xl/loose font-bold font-title">{{ siteName }}</h1>
  <p class="text-gray-500">輸入 8 碼統一編號，負責人名稱或公司、行號名稱關鍵字</p>
  <SearchBar />
</section>
</template>
