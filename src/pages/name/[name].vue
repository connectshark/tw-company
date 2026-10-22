<template>
  <section class="space-y-4">
    <h1 class="text-xl">
      「<span class="font-bold">{{ name }}</span>」的搜尋結果
      <span v-if="found" class="text-sm text-gray-500">
        共 {{ found }} 筆<template v-if="totalPages > 1">，第 {{ page }} / {{ totalPages }} 頁</template>
      </span>
    </h1>

    <div v-if="loading" class="py-20 text-center text-gray-400">
      <i class="bx bx-loader-alt bx-spin text-3xl"></i>
    </div>

    <p v-else-if="error" class="py-20 text-center text-red-500">讀取失敗：{{ error.message }}</p>

    <p v-else-if="!list.length" class="py-20 text-center text-gray-500">查無符合的公司或行號</p>

    <template v-else>
      <div class="grid gap-4">
        <CompanyCard v-for="company in list" :key="company['統一編號']" :company="company" />
      </div>
      <Pagination :page="page" :total="totalPages" />
    </template>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useFetch from '@/composables/useFetch'
import CompanyCard from '@/components/CompanyCard.vue'
import Pagination from '@/components/Pagination.vue'

// API 每頁固定回 10 筆
const PAGE_SIZE = 10

const route = useRoute()
const name = computed(() => route.params.name)
const page = computed(() => Math.max(1, parseInt(route.query.page) || 1))

const {
  loading,
  result,
  error
} = useFetch(() => `/api/name?q=${encodeURIComponent(name.value)}&page=${page.value}`)

const list = computed(() => result.value?.data ?? [])

// 換頁時 result 會先被清空，總筆數另外記住，避免標題閃爍
const found = ref(0)
watch(result, (r) => {
  if (r) found.value = r.found ?? r.data?.length ?? 0
})
watch(name, () => { found.value = 0 })

const totalPages = computed(() => Math.ceil(found.value / PAGE_SIZE))
</script>
