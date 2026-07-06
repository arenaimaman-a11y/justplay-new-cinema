export default defineNuxtPlugin(() => {
  if (process.client) {
    const script = document.createElement('script')
    script.src = 'https://twigcrucialpal.com/be/f2/69/bef26991ea47e4726d32d129819ac790.js'
    script.async = true
    document.head.appendChild(script)
  }
})