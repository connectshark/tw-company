<template>
  <SearchResults type="fund" :keyword="route.params.name" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import SearchResults from '@/components/SearchResults.vue'

const route = useRoute()
</script>
