import { createRouter, createWebHistory } from 'vue-router'
import { getUser } from '../services/authService'
import LoginPage from '../pages/auth/LoginPage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'
import CheckoutPage from '../pages/kasir/CheckoutPage.vue'
import HomePage from '../pages/kasir/HomePage.vue'
import AdminDashboard from '../pages/admin/AdminDashboard.vue'
import ManageUser from '../pages/admin/ManageUser.vue'
import TransactionPage from '../pages/kasir/TransactionPage.vue'
import ProductPage from '../pages/kasir/ProductPage.vue'
import EditProductPage from '../pages/kasir/EditProductPage.vue'
import StrukPage from '../pages/kasir/StrukPage.vue'
import TransactionsPage from '../pages/kasir/transactionsPage.vue'
import TransactionDetailPage from '../pages/kasir/TransactionDetailPage.vue'
import ReportPage from '../pages/kasir/ReportPage.vue'

const routes = [
    {path: '/', component: LoginPage},
    {path: '/register', component: RegisterPage},
    {
        path: '/home',
        component: HomePage,
        meta: { requiresAuth: true, roles: ["kasir"] }
    },

    // products
    {
        path: '/products',
        component: ProductPage,
        meta: { requiresAuth: true, roles: ["kasir"] }
    },
    {
        path: '/products/:id/edit',
        name: 'edit-product',
        component: EditProductPage,
        meta: { requiresAuth: true, roles: ["kasir"] }
    },
    {
        path: '/transaction', 
        component: TransactionPage,
        meta: { requiresAuth: true, roles: ['kasir'] }
    },
    {
        path: '/transactions',
        component: TransactionsPage,
        meta: { requiresAuth: true, roles: ['kasir'] }
    },
    {
        path: '/transactions/:id',
        name: 'transaction-detail',
        component: TransactionDetailPage,
        meta: { requiresAuth: true, roles: ['kasir'] }
    },
    {
        path: '/transaction/checkout', 
        component: CheckoutPage,
        meta: { requiresAuth: true, roles: ['kasir'] }
    },
    {
        path: '/transaction/struk',
        component: StrukPage,
        meta: { requiresAuth: true, roles: ['kasir'] }
    },
    {
        path: '/transaction/struk', 
        component: CheckoutPage,
        meta: { requiresAuth: true, roles: ['kasir'] }
    },
    {
        path: '/admin',
        component: AdminDashboard,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/user',
        component: ManageUser,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/report',
        component: ReportPage,
        meta: { requiresAuth: true, roles: ['kasir'] }
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