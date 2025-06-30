<template>
    <div class="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
        <div class="struk-print-area">
            <h2 class="text-xl font-semibold text-center mb-4">Struk Transaksi</h2>
            <div class="text-sm text-gray-700 mb-4">
                <p><strong>Nomor Transaksi:</strong> {{ struk?.invCode || 'N/A' }}</p>
                <p><strong>Tanggal:</strong> {{ struk?.created_at || 'Baru Saja' }}</p>
                <p><strong>Metode:</strong> {{ struk?.payment_type }}</p>
            </div>
            <hr class="mb-4"/>
            <table class="w-full text-sm mb-4">
                <thead>
                    <tr class="text-left border-b">
                        <th>Produk</th>
                        <th>Qty</th>
                        <th class="text-right">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cart" :key="item.id" class="border-b">
                        <td>{{ item.nama }}</td>
                        <td>{{ item.qty }}</td>
                        <td class="text-right">Rp {{ (item.harga * item.qty).toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>
    
            <div class="text-sm text-gray-800 space-y-1">
                <div class="flex justify-between">
                    <span>Total</span>
                    <strong>Rp {{ total.toLocaleString() }}</strong>
                </div>
                <div class="flex justify-between">
                    <span>Bayar</span>
                    <span>Rp {{ paid.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Kembalian</span>
                    <span>Rp {{ kembalian.toLocaleString() }}</span>
                </div>
            </div>
        </div>
        <div class="mt-6 flex justify-end gap-4">
            <button @click="kembaliKeAwal" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded">
                Selesai
            </button>
            <button @click="cetakStruk()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                Cetak
            </button>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router    = useRouter()
    const struk     = ref(null)
    const cart      = ref([])
    const paid      = ref(0)
    const total     = ref(0)
    const kembalian = ref(0)

    console.log(localStorage.getItem('struk'))

    onMounted(() => {
        const storedStruk   = localStorage.getItem('struk')
        const storedCart    = localStorage.getItem('cart_before_checkout')
        const storedPaid    = localStorage.getItem('paid_amount')

        if (!storedStruk || !storedCart) {
            router.push('/transaction')
            return
        }

        struk.value     = JSON.parse(storedStruk)
        cart.value      = JSON.parse(storedCart)
        paid.value      = JSON.parse(storedPaid)
        total.value     = cart.value.reduce((sum, item) => sum + (item.harga * item.qty), 0)
        kembalian.value = paid.value - total.value
    })

    function cetakStruk(){
        window.print()
    }

    function kembaliKeAwal() {
        localStorage.removeItem('struk')
        localStorage.removeItem('cart_before_checkout')
        localStorage.removeItem('paid_amount')
        router.push('/transaction')
    }
</script>