import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
    }),
    getters: {  
        totalItems: (state) => state.items.reduce((sum, item) => sum + item.qty, 0),
        totalPrice: (state) => state.items.reduce((sum, item) => sum + item.qty * item.price, 0)
    },
    actions: {
        add(product) {  
            const existing = this.items.find((item) => item.id === product.id)
            if (existing) {
                existing.qty++
            } else {
                this.items.push({ ...product, qty: 1 })
            }
        },
        remove(id) {
            this.items = this.items.filter((item) => item.id !== id)
        },
        clear() {
            this.items = []
        }
    }
})