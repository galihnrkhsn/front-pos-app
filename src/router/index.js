import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import Checkout from '../pages/CheckoutPage.vue'

const routes = [
    {path: '/', component: HomePage},
    {path: '/checkout', component: Checkout}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router