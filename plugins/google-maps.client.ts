export default defineNuxtPlugin({
    name: 'google-maps',
    enforce: 'pre',
    async setup() {
        const config = useRuntimeConfig()

        if (process.client) {
            const script = document.createElement('script')
            script.type = 'module'
            script.src = 'https://unpkg.com/@googlemaps/extended-component-library@0.6'
            document.head.appendChild(script)
        }
    }
})