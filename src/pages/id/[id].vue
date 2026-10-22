<template>
  <div v-if="loading" class="py-20 text-center text-gray-400">
    <i class="bx bx-loader-alt bx-spin text-3xl"></i>
  </div>

  <p v-else-if="error" class="py-20 text-center text-red-500">讀取失敗：{{ error.message }}</p>

  <section v-else-if="!data" class="py-20 text-center">
    <p class="text-gray-500">查無統一編號 {{ id }} 的資料</p>
  </section>

  <article v-else class="space-y-6">
    <header class="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="text-2xl font-bold">{{ info.name }}</h1>
        <StatusBadge :status="info.status" />
      </div>
      <div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
        <p class="text-gray-500 tabular-nums">統一編號 {{ id }}</p>
        <a
          :href="`https://company.g0v.ronny.tw/index/changelog/${id}`"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <i class="bx bx-history"></i>異動紀錄
          <i class="bx bx-link-external text-xs"></i>
        </a>
      </div>

      <dl class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div v-for="item in highlights" :key="item.label">
          <dt class="text-xs text-gray-500">{{ item.label }}</dt>
          <dd class="mt-0.5 font-bold tabular-nums">
            <router-link v-if="item.to" :to="item.to" class="text-primary hover:underline">{{ item.value }}</router-link>
            <template v-else>{{ item.value || '—' }}</template>
          </dd>
        </div>
      </dl>
    </header>

    <section
      v-for="group in groups"
      :key="group.title"
      class="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md"
    >
      <h2 class="mb-4 flex items-center gap-2 font-bold">
        <span class="h-4 w-1 rounded-full bg-primary"></span>{{ group.title }}
      </h2>
      <dl class="divide-y divide-gray-100">
        <div v-for="[label, value] in group.fields" :key="label" class="grid gap-1 py-2.5 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt class="text-sm text-gray-500">{{ label }}</dt>
          <dd><FieldValue :value="value" :label="label" /></dd>
        </div>
      </dl>
    </section>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead, useSeoMeta } from '@unhead/vue'
import useFetch from '@/composables/useFetch'
import FieldValue from '@/components/FieldValue.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { summarize, formatDate, searchLink, businessItems, toISODate, isEmptyRecord } from '@/utils/company'

const route = useRoute()
const id = computed(() => route.params.id)

const {
  loading,
  result,
  error
} = useFetch(() => `/api/show/${id.value}`)

const data = computed(() => (isEmptyRecord(result.value?.data) ? null : result.value.data))
const info = computed(() => summarize(data.value ?? {}))

const highlights = computed(() => [
  { label: '負責人', value: info.value.owner, to: info.value.owner ? searchLink('name', info.value.owner) : null },
  { label: '資本額（元）', value: info.value.capital },
  { label: '組織類型', value: info.value.org },
  { label: '核准設立', value: info.value.founded ? formatDate(info.value.founded) : '' }
])

// 一般欄位放「登記資料」，巢狀物件（如「財政部」）各自成一區
const groups = computed(() => {
  if (!data.value) return []
  const basic = []
  const sections = []
  for (const [key, value] of Object.entries(data.value)) {
    const isSection = key === '財政部' && value && typeof value === 'object'
    if (isSection) sections.push({ title: `${key}資料`, fields: Object.entries(value) })
    else basic.push([key, value])
  }
  return [{ title: '登記資料', fields: basic }, ...sections]
})

// SEO：標題、描述、結構化資料
const notFound = computed(() => !loading.value && (!data.value || !!error.value))

const pageTitle = computed(() => {
  if (notFound.value) return `查無統一編號 ${id.value}`
  if (!data.value) return `統一編號 ${id.value}`
  return `${info.value.name}（${id.value}）`
})

const description = computed(() => {
  if (!data.value) return ''
  const { name, owner, capital, org, status, founded, address } = info.value
  const items = businessItems(data.value).slice(0, 3)
  return [
    `${name}，統一編號 ${id.value}`,
    owner && `負責人 ${owner}`,
    capital && `資本額 ${capital} 元`,
    org,
    status,
    founded && `核准設立於 ${formatDate(founded)}`,
    address && `地址：${address}`,
    items.length && `營業項目：${items.join('、')}`
  ].filter(Boolean).join('，') + '。'
})

const jsonLd = computed(() => {
  if (!data.value) return null
  const { name, founded, address } = info.value
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    legalName: name,
    taxID: id.value,
    url: `${import.meta.env.VITE_SITE_URL}/id/${id.value}`,
    ...(founded && { foundingDate: toISODate(founded) }),
    ...(address && {
      address: { '@type': 'PostalAddress', streetAddress: address, addressCountry: 'TW' }
    })
  }
})

useSeoMeta({
  title: pageTitle,
  description: () => description.value || undefined,
  ogTitle: () => (data.value ? `${pageTitle.value}｜${import.meta.env.VITE_SITE_NAME}` : undefined),
  ogDescription: () => description.value || undefined,
  // 查無資料時 SPA 仍回 200，用 noindex 避免被當成軟 404 收錄
  robots: () => (notFound.value ? 'noindex' : undefined)
})

useHead({
  script: () => (jsonLd.value
    ? [{ type: 'application/ld+json', key: 'company-jsonld', textContent: JSON.stringify(jsonLd.value) }]
    : [])
})
</script>
