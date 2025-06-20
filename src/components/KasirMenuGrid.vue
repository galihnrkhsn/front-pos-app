<template>
    <div class="p-6">
        <h2 class="text-2xl font-semibold mb-6">
            Menu Kasir
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <button v-for="menu in menus" :key="menu.title" @click="handleClick(menu)"
                class="group bg-white hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-2xl shadow-md p-6 flex-flex-col items-center justify-center transition transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            >
                <component :is="menu.icon"  class="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                <span class="text-lg font-medium text-center">{{ menu.title }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router'
    import {
        ShoppingCartIcon,
        MagnifyingGlassIcon,
        PrinterIcon,
        ArrowUturnLeftIcon,
        ChartBarIcon
    } from '@heroicons/vue/24/solid'

    const router = useRouter()

    const menus = [
        { title: 'Transaksi', icon: ShoppingCartIcon, route: '/transaction' },
        { title: 'Cari Produk', icon: MagnifyingGlassIcon, route: '/checkout' },
        { title: 'Cetak Struk', icon: PrinterIcon, route: '/checkout' },
        { title: 'Retur Barang', icon: ArrowUturnLeftIcon, route: '/checkout' },
        { title: 'Laporan', icon: ChartBarIcon, route: '/checkout' },
    ]

    function handleClick(menu) {
        if (menu.route) {
            router.push(menu.route)
        } else if (menu.action) {
            menu.action()
        }
    }
</script>