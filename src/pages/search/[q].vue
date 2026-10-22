<template>
  <SearchResults type="search" :keyword="route.params.q" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import SearchResults from '@/components/SearchResults.vue'

const route = useRoute()
</script>
