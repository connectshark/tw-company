import { ref, toValue, watch } from "vue"

/**
 * @param {string | (() => string) | import('vue').Ref<string>} path
 */
export default (path, { immediate = true } = {}) => {
  const loading = ref(false)
  const result = ref(null)
  const error = ref(null)
  const URI = import.meta.env.VITE_API_URI

  const doFetch = async () => {
    loading.value = true
    result.value = null
    error.value = null
    try {
      const response = await fetch(URI + toValue(path))
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      result.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  watch(() => toValue(path), doFetch, { immediate })

  return {
    doFetch,
    loading,
    result,
    error
  }
}
