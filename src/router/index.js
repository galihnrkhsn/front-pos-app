import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/auth/LoginPage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'
import CheckoutPage from '../pages/kasir/CheckoutPage.vue'
import HomePage from '../pages/kasir/HomePage.vue'
import AdminDashboard from '../pages/admin/AdminDashboard.vue'
import ManageUser from '../pages/admin/ManageUser.vue'
import { getUser } from '../services/authService'

const routes = [
    {path: '/', component: LoginPage},
    {path: '/register', component: RegisterPage},
    {
        path: '/home', 
        component: HomePage,
        meta: { requiresAuth: true, roles: ["kasir"] }
    },
    {
        path: '/checkout', 
        component: CheckoutPage,
        meta: { requiresAuth: true, roles: ['kasir'] }
    },
    {
        path: '/admin',
        component: AdminDashboard,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/dmin/user',
        component: ManageUser,
        meta: { requiresAuth: true, roles: ['admin'] }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const user = getUser()
    if (to.meta.requiresAuth && !user) {
        next('/')
    } else if (to.meta.roles && user && !to.meta.roles.includes(user.role)) {
        next('/home')
    } else {
        next()
    }
})

export default router