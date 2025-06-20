<template>
    <div class="shadow rounded p-6">
        <PageHeader title="Transaction" @back="goBack"/>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
                <h3 class="text-lg font-medium mb-2">Produk</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <button v-for="product in products" :key="product.id" @click="addToCart(product)"
                        class="bg-white hover:bg-blue-50 border rounded-lg p-4 flex flex-col items-center shadow transition cursor-pointer"
                    >
                        <div class="font-semibold text-sm mb-1">
                            {{ product.nama }}
                        </div>
                        <div class="text-gray-500 text-xs">
                            {{ product.harga.toLocaleString() }}
                        </div>
                    </button>
                </div>
            </div>
            <div class="p-4 rounded border">
                <h3 class="text-lg font-medium mb-2">Keranjang</h3>
                <div v-if="cart.length === 0" class="text-sm text-gray-400">
                    Keranjang Kosong
                </div>
                <ul v-else>
                    <li v-for="item in cart" :key="item.id" class="flex justify-between items-center mb-2">
                        <div>
                            <div class="font-medium">{{ item.nama }}</div>
                            <div class="text-xs text-gray-500">{{ item.qty }}  x {{ formatRupiah(item.harga) }}</div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button @click="decreaseQty(item)">➖</button>
                            <span>{{ item.qty }}</span>
                            <button @click="increaseQty(item)">➕</button>
                            <button @click="removeItem(item)" class="text-red-500">✕</button>
                        </div>
                    </li>
                </ul>
                <div class="mt-4 border-t pt-2 text-right">
                    <div>
                        Total: <strong>Rp {{ total.toLocaleString() }}</strong>
                    </div>
                    <button @click="checkout" class="mt-2 bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded"
                        :disabled="cart.length === 0"
                    >
                        Bayar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import axios from 'axios'
    import { getUser } from '../../services/authService'
    import PageHeader from '../../components/ui/PageHeader.vue';
    import { useRouter } from 'vue-router';

    const router = useRouter()
    const products = ref([])
    const cart = ref([])
    const user = getUser()
    function goBack(){
        router.back()
    }

    onMounted(() => {
        loadProducts()
    })

    async function loadProducts() {
        try {
            const response = await axios.get("http://localhost/project/pos-app/public/products", {
                withCredentials: true
            })
            if (response.data.status === 'success') {
                products.value = response.data.data.map(p => ({
                    id: p.productId,
                    nama: p.productName,
                    harga: parseInt(p.price),
                    stok: parseInt(p.stock),
                    barcode: p.barcode,
                    kategori: p.category
                }))
            }
        } catch (err) {
            console.error('Gagal mengambil Products:', err)
        }
    }

    function addToCart(product) {
        const existing = cart.value.find(item => item.id === product.id)
        if (existing) {
            existing.qty += 1
        } else {
            cart.value.push({...product, qty: 1})
        }
    }

    function increaseQty(item) {
        item.qty++
    }

    function decreaseQty(item) {
        if (item.qty > 1) item.qty--
        else removeItem(item)
    }

    function removeItem(item) {
        cart.value = cart.value.filter(i => i.id !== item.id)
    }

    const total = computed(() => 
        cart.value.reduce((sum, item) => sum + item.harga * item.qty, 0)
    )

    function formatRupiah(value) {
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
    }

    function checkout() {
        localStorage.setItem('cart', JSON.stringify(cart.value))
        router.push('/transaction/checkout')
    }
</script>