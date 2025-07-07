
<template>
    <div class="p-4 max-w-4xl mx-auto shadow-sm">
        <PageHeader title="Detail Transaksi" @back="goBack"/>
        <div v-if="loading" class="text-gray-500">Memuat...</div>
        <div v-else-if="!transaction" class="text-red-500">Data tidak ditemukan.</div>
        <div v-else class="bg-white shadow p-6 rounded-lg border">
            <h2 class="text-lg font-bold text-indigo-700 mb-2">Invoice: {{ transaction.invoice }}</h2>
            <p class="text-sm text-gray-600">Kasir: {{ transaction.cashier }}</p>
            <p class="text-sm text-gray-600">Tanggal: {{ new Date(transaction.created_at).toLocaleString() }}</p>
            <p class="text-sm text-gray-600 capitalize">Pembayaran: {{ transaction.paymentType }}</p>
            <p class="text-lg font-semibold text-green-600 mt-2">Total: Rp {{ Number(transaction.totalPrice).toLocaleString() }}</p>

            <div class="mt-6">
                <h3 class="text-md font-semibold mb-2 text-gray-700">Daftar Item:</h3>
                <table class="w-full border text-sm">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="border px-3 py-2 text-left">Produk</th>
                            <th class="border px-3 py-2 text-center">Qty</th>
                            <th class="border px-3 py-2 text-right">Harga</th>
                            <th class="border px-3 py-2 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in transaction.items" :key="item.product_id">
                            <td class="border px-3 py-2">{{ item.productName }}</td>
                            <td class="border px-3 py-2 text-center">{{ item.qty }}</td>
                            <td class="border px-3 py-2 text-right">Rp {{ Number(item.price).toLocaleString() }}</td>
                            <td class="border px-3 py-2 text-right">Rp {{ Number(item.price * item.qty).toLocaleString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script setup>
    import axios from 'axios';
    import PageHeader from '../../components/ui/PageHeader.vue';
    import AlertMessage from '../../components/AlertMessage.vue';
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const API_URL       = 'http://localhost/project/pos-app/public/'
    const route         = useRoute()
    const router        = useRouter()
    const transaction   = ref(null)
    const loading       = ref(true)
    const alert         = ref({ type: '', message: '' })
    onMounted(() => {
        loadTransaction()
    })

    async function loadTransaction() {
        loading.value = true
        try {
            const response = await axios.get(`${API_URL}transactions/${route.params.id}`, {
                withCredentials: true
            })
            transaction.value = response.data.data
        } catch (err) {
            console.error('Error saat mengambil produk:', err.response?.data || err.message)
            alert.value = {
                type: 'error',
                message: 'Terjadi kesalahan saat menghubungi server', err
            }
        } finally {
            loading.value = false
        }
    }

    function goBack() {
        router.back()
    }
</script>   