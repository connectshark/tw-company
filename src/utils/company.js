export const isDate = (v) =>
  v !== null && typeof v === 'object' && !Array.isArray(v) && 'year' in v && 'month' in v && 'day' in v

export const formatDate = ({ year, month, day }) =>
  `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`

// 金額欄位：純數字字串補上千分位
export const formatMoney = (v) =>
  typeof v === 'string' && /^\d+$/.test(v) ? Number(v).toLocaleString('zh-TW') : v

const pick = (data, keys) => {
  for (const key of keys) {
    const v = data?.[key]
    if (v !== undefined && v !== null && v !== '') return Array.isArray(v) ? v[0] : v
  }
  return ''
}

// 公司（公司名稱/代表人…）、商業行號（商業名稱/負責人…）、分公司（分公司名稱/分公司經理…）欄位名稱不同，統一整理成摘要
export const summarize = (data = {}) => ({
  name: pick(data, ['公司名稱', '商業名稱', '分公司名稱', '名稱']) || data?.['財政部']?.['營業人名稱'] || '（未命名）',
  owner: pick(data, ['代表人姓名', '負責人姓名', '分公司經理姓名']),
  capital: formatMoney(pick(data, ['資本總額(元)', '資本額(元)', '實收資本額(元)'])),
  org: pick(data, ['組織類型', '組織別名稱']) || data?.['財政部']?.['組織別名稱'] || '',
  address: pick(data, ['公司所在地', '地址', '分公司所在地']),
  status: pick(data, ['公司狀況', '登記現況', '分公司狀況']),
  authority: pick(data, ['登記機關']),
  founded: data?.['核准設立日期'],
  updated: data?.['最近異動日期']
})

export const isActive = (status = '') => /核准設立|營業中/.test(status)

// 三種搜尋：路由前綴 = key，對應 g0v API
export const SEARCH_TYPES = {
  search: { label: '公司', api: '/api/search', placeholder: '輸入統一編號或公司、行號名稱' },
  name: { label: '人名', api: '/api/name', placeholder: '輸入負責人或董監事姓名' },
  fund: { label: '法人', api: '/api/fund', placeholder: '輸入公司名稱，找它以法人身分投資的公司' }
}

export const searchLink = (type, q) => `/${type}/${encodeURIComponent(q)}`

const PERSON_KEYS = ['姓名', '代表人姓名', '負責人姓名', '分公司經理姓名']

// 欄位值可以連到搜尋頁時回傳 { to, text }
export const linkFor = (label, value) => {
  if (PERSON_KEYS.includes(label) && typeof value === 'string' && value) {
    return { to: searchLink('name', value), text: value }
  }
  // 所代表法人格式為 [統編, 法人名稱]
  if (label === '所代表法人' && Array.isArray(value) && value[1]) {
    return { to: searchLink('fund', value[1]), text: value[1] }
  }
  return null
}

export const toISODate = ({ year, month, day }) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

// 營業項目：商業行號是 "代碼 說明\n…" 字串，公司是 [[代碼, 說明], …]
export const businessItems = (data = {}) => {
  const raw = data['營業項目'] ?? data['所營事業資料'] ?? []
  const rows = typeof raw === 'string'
    ? raw.split('\n').map((line) => line.replace(/^[A-Z0-9]{5,8}\s+/, ''))
    : raw.map((row) => (Array.isArray(row) ? row[row.length - 1] : row))
  return rows.filter((s) => s && !s.startsWith('除許可業務外'))
}

// 查無統編時 API 不回 null，而是 { 財政部: {} } 這種全空的物件
export const isEmptyRecord = (data) => {
  const empty = (v) =>
    v === null || v === undefined || v === '' ||
    (Array.isArray(v) ? v.length === 0 : typeof v === 'object' && Object.values(v).every(empty))
  return empty(data)
}
