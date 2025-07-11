<template>
    <AlertMessage v-if="alert.message" :type="alert.type" :message="alert.message" />
    <PageHeader title="Report" @back="goBack" class="p-4 shadow rounded"/>
    <div class="p-4 shadow-sm bg-gray-50 rounded">
        <fieldset class="border border-gray-300 rounded p-4 mb-6">
            <legend class="text-sm text-gray-600 font-medium px-2">Pilih Jenis Laporan</legend>
            <div class="flex flex-wrap gap-4 items-center">
                <label class="inline-flex items-center gap-2">
                    <input type="radio" value="daily" v-model="filterType" class="accent-blue-500">
                    <span>Harian</span>
                </label>
                <label class="inline-flex items-center gap-2">
                    <input type="radio" value="monthly" v-model="filterType" class="accent-blue-500">
                    <span>Bulanan</span>
                </label>
                <label class="inline-flex items-center gap-2">
                    <input type="radio" value="yearly" v-model="filterType" class="accent-blue-500">
                    <span>Tahunan</span>
                </label>
            </div>
        </fieldset>

        <div class="flex flex-wrap gap-4 items-center mb-6">
            <template v-if="filterType === 'daily'">
                <input type="date" v-model="selectedDate" class="border px-3 py-2 rounded w-full sm:w-auto">
            </template>

            <template v-else-if="filterType === 'monthly'">
                <select v-model="selectedMonth" class="border px-3 py-2 rounded">
                    <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
                </select>
                <select v-model="selectedYear" class="border px-3 py-2 rounded">
                    <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                </select>
            </template>

            <template v-else-if="filterType === 'yearly'">
                <select v-model="selectedYear" class="border px-3 py-2 rounded">
                    <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                </select>
            </template>

            <button
                @click="loadReport"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            >
                Tampilkan
            </button>
            <button
                @click="exportExcel"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            >
                Export Excel
            </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-white shadow rounded p-4 flex items-center gap-3">
                <div class="text-blue-500 text-xl">
                    <i class="fas fa-receipt"></i>
                </div>
                <div>
                    <p class="text-gray-500 text-sm">Jumlah Transaksi</p>
                    <h3 class="text-xl font-semibold">{{ report.total_transaction }}</h3>
                </div>
            </div>

            <div class="bg-white shadow rounded p-4 flex items-center gap-3">
                <div class="text-green-500 text-xl">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <div>
                    <p class="text-gray-500 text-sm">Total Pendapatan</p>
                    <h3 class="text-xl font-semibold">Rp {{ report.total_income.toLocaleString() }}</h3>
                </div>
            </div>

            <div class="bg-white shadow rounded p-4 flex items-center gap-3">
                <div class="text-yellow-500 text-xl">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div>
                    <p class="text-gray-500 text-sm flex items-center gap-1">
                        Rata-rata Transaksi
                        <span title="Total pendapatan dibagi jumlah transaksi" class="text-gray-400 cursor-help">ℹ️</span>
                    </p>
                    <h3 class="text-xl font-semibold">Rp {{ report.avg_transaction.toLocaleString() }}</h3>
                </div>
            </div>

            <div class="bg-white shadow rounded p-4">
                <p class="text-gray-500 text-sm mb-1">Produk Terlaris</p>
                <ol class="list-decimal ml-4 text-sm">
                    <li v-for="product in report.top_products" :key="product.productName">
                        {{ product.productName }} ({{ product.terjual }} Terjual)
                    </li>
                </ol>
            </div>
            <div class="bg-white shadow rounded p-4">
                <p class="text-gray-500 text-sm mb-1">Metode Pembayaran</p>
                <ul class="list-disc ml-4 text-sm">
                    <li v-for="(total, metode) in report.payment_methods" :key="metode">
                        {{ formatPaymentCurrency(metode) }}: Rp {{ formatCurrency(total) }}
                    </li>
                </ul>
            </div>
            <div class="bg-white shadow rounded p-4">
                <p class="text-gray-500 text-sm mb-1">Top Kasir</p>
                <ol class="list-decimal ml-4 text-sm">
                    <li v-for="cashier in report.top_cashier" :key="cashier.user_id">
                        {{ cashier.name }} ({{ cashier.total_transaction }} Transaksi)
                    </li>
                </ol>
            </div>
        </div>
    </div>

</template>
<script setup>
    import { ref } from 'vue';
    import PageHeader from '../../components/ui/PageHeader.vue';
    import axios from 'axios';
    import AlertMessage from '../../components/AlertMessage.vue';
    import { useRouter } from 'vue-router';
    import * as XLSX from 'xlsx';

    const filterType        = ref('daily')
    const selectedDate      = ref(new Date().toISOString().slice(0, 10))
    const selectedMonth     = ref(new Date().getMonth() + 1)
    const selectedYear      = ref(new Date().getFullYear())
    const alert             = ref({ type: '', message: '' })
    const loading           = ref(false)
    const router            = useRouter()
    const API_URL           = 'http://localhost/project/pos-app/public/'

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September',
        'Oktober', 'November', 'Desember'
    ]

    const availableYears = [
        2023, 2024, 2025
    ]

    const report = ref({
        total_income: 0,
        total_transaction: 0,
        avg_transaction: 0,
        payment_methods: {},
        top_products: []
    })

    async function loadReport() {
        let params = {}

        if (filterType.value === 'daily') {
            params = { type: 'daily', date: selectedDate.value }
        } else if (filterType.value === 'monthly') {
            params = { type: 'monthly', month: selectedMonth.value, year: selectedYear.value }
        } else if (filterType.value === 'yearly') {
            params = { type: 'yearly', year: selectedYear.value }
        }

        try {
            const res = await axios.get(`${API_URL}report`, {
                params,
                withCredentials: true
            })
            report.value = res.data.data

            if (!res.data.data.total_transaction || parseInt(res.data.data.total_transaction) === 0) {
                alert.value = { type: '', message: '' }
                setTimeout(() => {
                    alert.value = {
                        type: 'warning',
                        message: 'Tidak ada transaksi pada periode tersebut.'
                    }
                }, 10)
                return false
            } else {
                alert.value = { type: '', message: '' }
                return true
            }
        } catch (err) {
            console.error('Gagal mengambil data laporan: ', err)
            alert.value = { type: '', message: '' }
            setTimeout(() => {
                alert.value = {
                    type: 'error',
                    message: 'Gagal mengambil data Laporan.'
                }
            }, 10)
            return false
        } finally {
            loading.value = false
        }
    }

    async function exportExcel() {
        const success = await loadReport()

        if (!success) {
            alert.value = { type: '', message: '' }
            setTimeout(() => {
                alert.value = {
                    type: 'error',
                    message: 'Export gagal, tidak ada transaksi di periode tersebut!.'
                }
            }, 10)
            return
        }
        const exportData = [
            {
                'Total Pendapatan': report.value.total_income,
                'Total Transaksi': report.value.total_transaction,
                'Rata-rata Transaksi': report.value.avg_transaction
            }
        ]

        const exportTopProducts = report.value.top_products?.map(p => ({
            'Produk Terlaris': p.productName,
            'Terjual': p.terjual
        })) || []

        const exportPaymentMethod = Object.entries(report.value.payment_methods || {}).map(([metode, total]) => ({
            'Metode': metode,
            'Total': total
        }))

        const wb = XLSX.utils.book_new()
        const ws1 = XLSX.utils.json_to_sheet(exportData)
        XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan')

        const ws2 = XLSX.utils.json_to_sheet(exportTopProducts)
        XLSX.utils.book_append_sheet(wb, ws2, 'Produk Terlaris')

        const ws3 = XLSX.utils.json_to_sheet(exportPaymentMethod)
        XLSX.utils.book_append_sheet(wb, ws3, 'Metode Pembayaran')

        XLSX.writeFile(wb, 'Laporan-penjualan.xlsx')
    }

    function formatCurrency(total) {
        return Number(total).toLocaleString('id-ID')
    }

    function formatPaymentCurrency(metode) {
        const mapping = {
            'cash': 'Cash',
            'edc': 'EDC',
            'qris': 'QRIS',
            'transfer': 'Transfer'
        }
        return mapping[metode] || metode
    }

    function goBack() {
        router.back()
    }
</script>