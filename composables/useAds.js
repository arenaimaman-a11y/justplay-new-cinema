// composables/useAds.js
export const useAds = () => {
  const triggerAdsterra = () => {
    if (process.client) {
      window.open('https://www.google.co.id/index.html', '_blank')
    }
  }

  return {
    triggerAdsterra
  }
}