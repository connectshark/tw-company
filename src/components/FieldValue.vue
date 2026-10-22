<script setup>
import { computed } from 'vue'
import { isDate, formatDate, formatMoney, linkFor } from '@/utils/company'

const props = defineProps({
  value: { default: null },
  label: { type: String, default: '' }
})

const kind = computed(() => {
  const v = props.value
  if (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) return 'empty'
  if (isDate(v)) return 'date'
  if (Array.isArray(v)) {
    if (v.every(Array.isArray)) return 'rows'
    if (v.every((i) => i && typeof i === 'object')) return 'table'
    return 'list'
  }
  if (typeof v === 'object') return 'object'
  if (typeof v === 'string' && v.includes('\n')) return 'lines'
  return 'text'
})

const link = computed(() => linkFor(props.label, props.value))

const isMoney = computed(() => /額|資本/.test(props.label))
const text = computed(() => (isMoney.value ? formatMoney(props.value) : props.value))

// 營業項目這類 "I401010 一般廣告服務業" 拆成代碼 + 說明
const lines = computed(() =>
  String(props.value).split('\n').filter(Boolean).map((line) => {
    const m = line.match(/^([A-Z0-9]{5,8})\s+(.*)$/)
    return m ? [m[1], m[2]] : [line]
  })
)

const tableKeys = computed(() =>
  kind.value === 'table' ? [...new Set(props.value.flatMap((row) => Object.keys(row)))] : []
)
</script>

<template>
  <router-link v-if="link" :to="link.to" class="text-primary hover:underline">{{ link.text }}</router-link>

  <span v-else-if="kind === 'empty'" class="text-gray-400">—</span>

  <span v-else-if="kind === 'date'" class="tabular-nums">{{ formatDate(value) }}</span>

  <ul v-else-if="kind === 'lines' || kind === 'rows'" class="space-y-1.5">
    <li v-for="(row, i) in (kind === 'lines' ? lines : value)" :key="i" class="flex items-start gap-2">
      <code
        v-if="row.length > 1"
        class="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-bold text-primary"
      >{{ row[0] }}</code>
      <span>{{ row.length > 1 ? row.slice(1).join(' ') : row[0] }}</span>
    </li>
  </ul>

  <ul v-else-if="kind === 'list'" class="flex flex-wrap gap-1.5">
    <li v-for="(item, i) in value" :key="i" class="rounded-full bg-gray-100 px-2.5 py-0.5 text-sm">{{ item }}</li>
  </ul>

  <div v-else-if="kind === 'table'" class="overflow-x-auto">
    <table class="w-full text-left text-sm">
      <thead class="text-gray-500">
        <tr>
          <th v-for="k in tableKeys" :key="k" class="whitespace-nowrap border-b border-gray-200 py-1.5 pr-4 font-normal">{{ k }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in value" :key="i" class="border-b border-gray-100 last:border-0">
          <td v-for="k in tableKeys" :key="k" class="py-1.5 pr-4 align-top">
            <FieldValue :value="row[k]" :label="k" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <dl v-else-if="kind === 'object'" class="space-y-1">
    <div v-for="(v, k) in value" :key="k" class="flex gap-2">
      <dt class="shrink-0 text-gray-500">{{ k }}</dt>
      <dd><FieldValue :value="v" :label="label" /></dd>
    </div>
  </dl>

  <span v-else class="wrap-break-word">{{ text }}</span>
</template>
