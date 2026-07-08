// composables/useAds.js
export const useAds = () => {
  const triggerAdsterra = () => {
    if (process.client) {
      window.open('https://s.pemsrv.com/v1/link.php?cat=&idzone=5969324&type=8', '_blank')
    }
  }

  return {
    triggerAdsterra
  }
}
