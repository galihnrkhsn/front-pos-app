<template>
    <AlertMessage v-if="alert.message" :type="alert.type" :message="alert.message" />
    <div class="p-4 max-w-5xl mx-auto shadow-sm">
        <PageHeader title="Semua Transaksi" @back="goBack" />
        <div class="text-sm text-gray-600 mb-2">
            Total Pemasukan Hari ini: <span class="text-gray-600 font-semibold">Rp {{ totalHarian.toLocaleString() }}</span>
        </div>
        <div class="flex flex-wrap items-center gap-3 mb-6">
            <input 
                v-model="search"
                type="text"
                placeholder="Cari..."
                class="px-3 py-2 border rounded-md flex-1 min-w-[150px] sm:w-64"
            >
            <input 
                v-model="dateFilter"
                type="date"
                class="px-3 py-2 border rounded-md w-auto sm:w-48"
            >
            <select
                v-model="sortOrder"
                class="px-3 py-2 border rounded-md w-auto sm:w-48"
            >
                <option value="desc">Terbaru</option>
                <option value="asc">Terlama</option>
            </select>
            <select
                v-model="selectedMonth"
                class="px-3 py-2 border rounded-md w-auto sm:w-48"
            >
                <option v-for="(month, index) in months" :value="index + 1" :key="index">{{ month }}</option>
            </select>
            <select 
                v-model="selectedYear"
                class="px-3 py-2 border rounded-md w-auto sm:w-48"
            >
                <option v-for="year in availableYears" :key="year">{{ year }}</option>
            </select>
            <button
                @click="filterByMonth"
                class="bg-indigo-500 text-white px-4 py-2 rounded text-sm hover:bg-indigo-600 cursor-pointer"
            >
                Tampilkan
            </button>
            <button
                @click="showExportModal = true"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm cursor-pointer"
            >
                Export Excel
            </button>
        </div>
        <div v-if="loading" class="text-gray-500">Memuat Transaksi...</div>
        <div v-else-if="filteredTransactions.length === 0" class="text-gray-500">Belum ada Transaksi</div>
        <div v-else class="space-y-4">
            <div
                v-for="trx in filteredTransactions"
                :key="trx.transactionId"
                @click="router.push(`/transactions/${trx.transactionId}`)"
                class="bg-white p-4 rounded-lg shadow border flex justify-between items-center cursor-pointer"
            >
                <div>
                    <h2 class="text-lg font-semibold text-indigo-700">#{{ trx.invoice }}</h2>
                    <p class="text-sm text-gray-600">Kasir: {{ trx.cashier }}</p>
                    <p class="text-sm text-gray-600">Tanggal: {{ new Date(trx.created_at).toLocaleString() }}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-600 capitalize">Metode: {{ trx.paymentType }}</p>
                    <p class="text-lg font-bold text-green-600">Rp {{ Number(trx.totalPrice).toLocaleString() }}</p>
                </div>
            </div>
        </div>
        <Paginate 
            :current="currentPage"
            :total="totalPage"
            @change="changePage"
        />
        <ModalExport v-if="showExportModal" @close="showExportModal = false">
            <template #header>
                Export Laporan Transaksi
            </template>
            <template #body>
                <div class="flex flex-col gap-2">
                    <label>Dari Tanggal:</label>
                    <input type="date" v-model="exportStartDate" class="border rounded px-2 py-1">

                    <label>Sampai Tanggal:</label>
                    <input type="date" v-model="exportEndDate" class="border rounded px-2 py-1">
                </div>
            </template>

            <template #footer>
                <button class="bg-gray-300 px-3 py-1 rounded cursor-pointer" @click="showExportModal = false">Batal</button>
                <button class="bg-green-300 px-3 py-1 rounded cursor-pointer" @click="handleExport">Export</button>
            </template>
        </ModalExport>
    </div>
</template>
<script setup>
    import axios from 'axios';
    import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
    import { ref, onMounted, computed, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { saveAs } from 'file-saver';
    import AlertMessage from '../../components/AlertMessage.vue';
    import PageHeader from '../../components/ui/PageHeader.vue';
    import * as XLSX from "xlsx";
    import Paginate from '../../components/Paginate.vue';
    import ModalExport from '../../components/ModalExport.vue';

    const API_URL       = 'http://localhost/project/pos-app/public/'
    const alert         = ref({ type: '', message: '' })
    const transactions  = ref([])
    const search        = ref('')
    const dateFilter    = ref('')
    const sortOrder     = ref('desc')
    const loading       = ref(true)
    const router        = useRouter()
    const currentPage   = ref(1)
    const perPage       = 10
    const selectedMonth = ref(new Date().getMonth() + 1)
    const selectedYear  = ref(new Date().getFullYear())
    const showExportModal   = ref(false)
    const exportStartDate   = ref('')
    const exportEndDate     = ref('')
    
    
    const months        = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]

    const availableYears = [2023, 2024, 2025]

    function filterByMonth() {
        const bulan = String(selectedMonth.value).padStart(2, '0')
        const tahun = selectedYear.value
        const start = `${tahun}-${bulan}-01`
        const end   = `${tahun}-${bulan}-31`
        loadTransaction(start, end)
    }

    onMounted(() => {
        const today = new Date().toISOString().slice(0, 10)
        exportStartDate.value = today
        exportEndDate.value = today
        loadTransaction()
    })

    async function loadTransaction(){
        loading.value = true
        try {
            const response = await axios.get(`${API_URL}transactions`, {
                withCredentials: true
            })
            transactions.value = response.data.data
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

    function exportToExcel() {
        const ws = XLSX.utils.json_to_sheet(transactions.value.map(tx => ({
            Invoice: tx.invoice,
            Kasir: tx.cashier,
            Tanggal: tx.created_at,
            Total: tx.totalPrice,
            Metode:tx.paymentType
        })));

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Transaksi")
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
        saveAs(new Blob([wbout]), "transaksi.xlsx")
    }

    function goBack(){
        router.back()
    }

    const filteredTransactions = computed(() => {
        return transactions.value
        .filter(trx => {
            const keyword = search.value.toLowerCase()
            const invoiceMatch = trx.invoice.toLowerCase().includes(keyword)
            const cashierMatch = trx.cashier.toLowerCase().includes(keyword)
            const dateMatch = dateFilter.value 
                ? trx.created_at.startsWith(dateFilter.value) 
                : true
            return (invoiceMatch || cashierMatch) && dateMatch
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at)
            const dateB = new Date(b.created_at)
            return sortOrder.value === 'desc'
                ? dateB - dateA
                : dateA - dateB
        })
    })

    const totalPage = computed(() => {
        return Math.ceil(transactions.value.length / perPage)
    })

    const paginatedTransactions = computed(() => {
        const start = (currentPage.value - 1) * perPage
        return transactions.value.slice(start, start + perPage)
    })

    function changePage(page) {
        if (page >= 1 && page <= totalPage.value){
            currentPage.value = page
        }
    }

    const totalHarian = computed(() => {
        const today = new Date().toISOString().slice(0, 10)
        return transactions.value
            .filter(tx => tx.created_at.startsWith(today))
            .reduce((sum, tx) => sum + Number(tx.totalPrice), 0)
    })

    async function handleExport() {
        if (!exportStartDate.value || !exportEndDate.value) {
            alert.value = {
                type: 'error',
                message: 'Masukan Tanggal!'
            }
            return
        }

        try {
            const response = await axios.get(`${API_URL}transactions`, {
                params: {
                    'start_date': exportStartDate.value,
                    'end_date': exportEndDate.value
                },
                withCredentials: true,
            })

            const data = response.data.data

            const ws = XLSX.utils.json_to_sheet(data.map(tx => ({
                Invoice: tx.invoice,
                Kasir: tx.cashier,
                Tanggal: tx.created_at,
                Total: tx.totalPrice,
                Metode: tx.paymentType
            })))

            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "Transaksi")
            const wbout = XLSX.write(wb, {bookType: "xlsx", type: "array"})
            saveAs(new Blob([wbout]), `transaksi-${exportStartDate.value}-${exportEndDate.value}.xlsx`)

            showExportModal = false
        } catch (err) {
            console.error('Gagal Export:', err)
            alert.value = {
                type: 'error',
                message: 'Gagal mengexport data Transaksi!'
            }
        }
    }
</script>