<template>
  <section class="text-center">
    <h1 class=" text-3xl/loose">404</h1>
    <p><router-link class="underline" to="/">回首頁</router-link></p>
  </section>
</template>

<script setup>
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: '找不到頁面',
  robots: 'noindex'
})
</script>
