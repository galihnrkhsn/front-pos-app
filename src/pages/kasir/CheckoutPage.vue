<template>
    <div class="p-6 max-w-2xl mx-auto">
        <PageHeader title="Checkout" @back="goBack"/>

        <div v-if="cart.length">
            <div class="border rounded-lg p-4 bg-white mb-4 shadow">
                <h3 class="text-lg font-medium mb-3">Ringkasan Belanja</h3>
                <ul>
                    <li v-for="item in cart" :key="item.id" class="flex justify-between text-sm mb-2">
                        <div>{{ item.nama }} x {{ item.qty }}</div>
                        <div>{{ (item.qty * item.harga) ? (item.qty * item.harga).toLocaleString() : 0 }}</div>
                    </li>
                </ul>
                <div class="border-t pt-2 mt-2 text-right font-semibold">
                    Total: Rp. {{ total ? total.toLocaleString() : 0 }}
                </div>
            </div>
            <div class="border rounded-lg p-4 bg-white shadow">
                <h3 class="text-lg font-medium mb-3">Pembayaran</h3>
                <div class="mb-3">
                    <label class="block text-sm mb-1">Metode Pembayaran</label>
                    <select v-model="metode" class="w-full border rounded px-2 py-1">
                        <option value="cash">Tunai</option>
                        <option value="qris">QRIS</option>
                        <option value="edc">EDC</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-sm mb-1">Uang Dibayar (Rp)</label>
                    <input type="number" v-model.number="bayar" class="w-full border rounded px-2 py-1" :disabled="metode !== 'cash'">
                </div>
                <div class="mb-4 text-right font-semibold" v-if="metode === 'cash'">
                    <p v-if="kembalian < 0" class="text-red-700">Kembalian: Rp {{ kembalian.toLocaleString() }}</p>
                    <p v-else class="text-green-600">Kembalian: Rp  {{ kembalian.toLocaleString() }}</p>
                    
                </div>

                <button @click="prosesTransaksi"
                    :disabled="loading"
                    class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                >
                    {{ loading ? 'Memproses..' : 'Proses Transaksi' }}
                </button>
            </div>
        </div>

        <div v-else class="text-gray-500 text-center">
            Keranjang kosong. Silahkan kembali ke halaman Transaksi!
        </div>
    </div>
</template>


<script setup>
    import axios from 'axios';
    import PageHeader from '../../components/ui/PageHeader.vue';
    import { useRouter } from 'vue-router';
    import { ref, computed, onMounted } from 'vue'
    import { getUser } from '../../services/authService';

    const user      = getUser()
    const router    = useRouter()
    const cart      = ref([])
    const metode    = ref('')
    const bayar     = ref(0)
    const loading   = ref(false)
    const API_URL   = 'http://localhost/project/pos-app/public/'

    onMounted(() => {
        const savedCart = localStorage.getItem('cart')
        cart.value = savedCart ? JSON.parse(savedCart) : []
    }) 

    const total = computed(() => {
        return cart.value.reduce((sum, item) => {
            const qty = parseInt(item.qty) || 0
            const harga = parseInt(item.harga) || 0
            return sum + (qty * harga)
        }, 0)
    })

    const kembalian = computed(() => {
        return metode.value === 'cash' ? (bayar.value - total.value) : 0
    })

    async function prosesTransaksi() {
        if (metode.value === 'cash' && bayar.value < total.value) {
            alert('Uang tidak cukup!')
            return
        }

        loading.value = true

        try {
            const payload = {
                payment_type: metode.value,
                paid_amount: metode.value === 'cash' ? bayar.value : total.value,
                items: cart.value.map(item => ({
                    product_id: item.id,
                    qty: item.qty,
                    price: item.harga
                }))
            }
            const response = await axios.post(`${API_URL}transactions`, payload, {
                headers: { 'Content-type': 'application/json' },
                withCredentials: true,
            })

            const struk = response.data.data
            localStorage.setItem('struk', JSON.stringify(struk))
            localStorage.setItem('cart_before_checkout', JSON.stringify(cart.value))
            localStorage.setItem('paid_amount', bayar.value)

            localStorage.removeItem('cart')

            router.push('/transaction/struk')
        } catch (err) {
            console.error(err)
            alert('Gagal menyimpan Transaksi')
        } finally {
            loading.value = false
        }
    }
    function goBack(){
        router.back()
    }
</script>