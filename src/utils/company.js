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

// 公司（公司名稱/代表人…）與商業行號（商業名稱/負責人…）欄位名稱不同，統一整理成摘要
export const summarize = (data = {}) => ({
  name: pick(data, ['公司名稱', '商業名稱', '名稱']) || data?.['財政部']?.['營業人名稱'] || '（未命名）',
  owner: pick(data, ['代表人姓名', '負責人姓名']),
  capital: formatMoney(pick(data, ['資本總額(元)', '資本額(元)', '實收資本額(元)'])),
  org: pick(data, ['組織類型', '組織別名稱']) || data?.['財政部']?.['組織別名稱'] || '',
  address: pick(data, ['公司所在地', '地址']),
  status: pick(data, ['公司狀況', '登記現況']),
  authority: pick(data, ['登記機關']),
  founded: data?.['核准設立日期'],
  updated: data?.['最近異動日期']
})

export const isActive = (status = '') => /核准設立|營業中/.test(status)
