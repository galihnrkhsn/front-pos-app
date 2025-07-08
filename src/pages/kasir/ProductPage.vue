<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s ease;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }
</style>
<template>
    <AlertMessage v-if="alert.message" :type="alert.type" :message="alert.message"/>
    <PageHeader title="Product" @back="goBack" class="p-4 shadow rounded" />
    <div class="p-6 shadow rounded min-h-screen">
        <div class="flex items-center justify-between mb-6">
            <div class="flex gap-2">
                <button
                    @click="showAddModal = true"
                    class="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200 cursor-pointer"
                >
                    <PlusIcon class="h-5 w-5" />
                    <span>Tambah Produk</span>
                </button>
                <button
                    @click="bulkEdit = !bulkEdit" 
                    class="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200 cursor-pointer"
                >
                    {{ bulkEdit ? 'Batal edit' : 'Update Stock' }}
                </button>
                <button
                    v-if="bulkEdit"
                    @click="submitBulkUpdate"
                    class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200 cursor-pointer"
                >
                    Simpan Perubahan
                </button>
            </div>
        </div>
        <div class="flex flex-wrap gap-4 mb-6">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari Produk..."
                class="px-4 py-2 border border-gray-300 rounded w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
                v-model="selectedCategory"
                class="px-4 py-2 border border-gray-300 rounded w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                <option value="">Semua Kategori</option>
                <option
                    v-for="cat in categories"
                    :key="cat.categoryId"
                    :value="cat.categoryName"
                >
                    {{ cat.categoryName }}
                </option>
            </select>
        </div>
        <div v-if="loading" class="text-gray-500">Memuat Produk...</div>
        <div v-else-if="filteredProducts.length === 0" class="text-gray-500">
            Produk tidak ada.
        </div>
        <div v-else class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div
                v-for="product in paginateProducts"
                :key="product.productId"
                class="relative bg-white rounded-lg shadow-md hover:shadow-lg p-4 transition-all duration-200"
            >
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-700 truncate">
                        {{ product.productName }}
                    </h2>
                    <span
                        class="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                    >
                        {{ product.category }}
                    </span>
                </div>
                <p class="mb-2 text-xs text-gray-500">{{ product.barcode }}</p>
                <p class="text-green-600 font-bold text-lg">
                Rp {{ Number(product.price).toLocaleString() }}
                </p>
                <div class="flex items-center justify-between">
                    <div class="mt-2 text-sm text-gray-600 flex items-center gap-1">
                        <InboxStackIcon class="w-4 h-4 text-gray-400"/>
                        Stok: 
                        <template v-if="bulkEdit">
                            <input type="number" v-model.number="product.stock" class="w-16 border px-2 py-0.5 rounded text-sm">
                        </template>
                        <template v-else>
                            <p :class="product.stock < 5 ? 'text-red-500' : ''">{{ product.stock }}</p>
                        </template>
                    </div>
                    <div class="bottom-2 right-2 flex gap-2">
                        <PencilSquareIcon class="w-5 h-5 text-yellow-500 cursor-pointer transition hover:text-blue-500" @click="handleEdit(product)"/>
                        <TrashIcon class="w-5 h-5 text-red-500 cursor-pointer transition hover:text-blue-500" @click="handleDelete(product.productId)"/>
                    </div>
                </div>
            </div>
        </div>
        <ModalAdd :show="showAddModal" :categories="categories" @close="showAddModal = false" @submit="submitNewProduct"/>
    </div>
    <Paginate 
        :current="currentPage"
        :total="totalPage"
        @change="changePage"
    />
    <transition name="fade">
        <div v-if="showModal" class="fixed inset-0 bg-gray-500/60 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded shadow-md w-full max-w-md relative">
                <h3 class="text-lg font-semibold mb-4">Edit Produk</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Nama Produk</label>
                        <input type="text" v-model="editForm.productName" class="mt-1 w-full border px-3 py-2 rounded" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Kategori</label>
                        <select v-model="editForm.category_id" class="mt-1 w-full border px-3 py-2 rounded">
                            <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
                                {{ cat.categoryName || cat }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Harga</label>
                        <input type="number" v-model="editForm.price" class="mt-1 w-full border px-3 py-2 runded">
                    </div>
                </div>
                <div class="mt-6 flex justify-end gap-2">
                    <button @click="showModal = false" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer">Batal</button>
                    <button @click="submitEdit" class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 cursor-pointer">Simpan</button>
                </div>

                <button @click="showModal = false" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">x</button>
            </div>
        </div>
    </transition>
</template>


<script setup>
    import PageHeader from '../../components/ui/PageHeader.vue';
    import axios from 'axios'
    import AlertMessage from '../../components/AlertMessage.vue';
    import ModalAdd from '../../components/products/ModalAdd.vue';
    import { ref, computed, onMounted } from 'vue'
    import { getUser } from '../../services/authService'
    import { useRouter } from 'vue-router';
    import { InboxStackIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline';
    import Paginate from '../../components/Paginate.vue';

    const alert             = ref({ type: '', message: '' })
    const products          = ref([])
    const searchQuery       = ref('')
    const router            = useRouter()
    const selectedCategory  = ref('')
    const categories        = ref([])
    const loading           = ref(true)
    const showModal         = ref(false)
    const showAddModal      = ref(false)
    const bulkEdit          = ref(false)
    const currentPage       = ref(1)
    const perPage           = 12
    const API_URL           = 'http://localhost/project/pos-app/public/'
    const editForm          = ref({
        productId: null,
        category_id: 0,
        productName: '',
        price: 0,
    })

    onMounted(async() => {
        await loadProduct()
        await loadCategory()
    }) 

    function handleEdit(product) {
        editForm.value = {
            productId: product.productId,
            productName: product.productName || '',
            category_id: product.category_id || 0,
            price: product.price || 0
        }
        showModal.value = true
    }

    async function loadProduct() {
        try {
            loading.value = true
            const response = await axios.get(`${API_URL}products`, {
                withCredentials: true
            })  
            products.value = response.data.data
        } catch (err) {
            console.error('Error saat mengambil produk:', err.response?.data || err.message)
            alert.value = {
                type: 'error',
                message: 'Terjadi kesalahan saat menghubungi server'
            }
        } finally {
            loading.value = false
        }
    }

    async function loadCategory() {
        try {
            loading.value = true
            const response = await axios.get(`${API_URL}categories`, {
                withCredentials: true
            })
            categories.value = response.data.data
        } catch (err) {
            console.error('Gagal memuat Kategori', err)
        } finally {
            loading.value = false
        }
    }

    async function submitNewProduct(data) {
        try {
            await axios.post(`${API_URL}products`, data, {
                withCredentials: true
            })
            showAddModal.value = false
            await loadProduct()
            alert.value = { type: '', message: '' }
            setTimeout(() => {
                alert.value = {
                    type: 'success',
                    message: 'Berhasil menambahkan produk baru!'
                }
            }, 10)

        } catch (err) {
            console.error('Error saat menambahkan produk:', err.response?.data || err.message)
            alert.value = { type: '', message: '' }
            setTimeout(() => {
                alert.value = {
                    type: 'error',
                    message: 'Terjadi kesalahan saat menghubungi server!', err
                }
            }, 10)
        }
    }

    async function submitEdit() {
        try {
            const res = await axios.put(`${API_URL}products/${editForm.value.productId}`, {
                productName: editForm.value.productName,
                category_id: editForm.value.category_id,
                price: editForm.value.price
            }, {
                withCredentials: true
            })

            if (res.data.status === 'success') {
                alert.value = { type: '', message: '' }
                setTimeout(() => {
                    alert.value = {
                        type: 'success',
                        message: 'Produk berhasil diperbarui!'
                    }
                }, 10)
                showModal.value = false
                await loadProduct()
            } else {
                alert.value = { type: '', message: '' }
                setTimeout(() => {
                    alert.value = {
                        type: 'error',
                        message: 'Produk gagal diperbarui!'
                    }
                }, 10)
            }

        } catch (err) {
            alert.value = { type: '', message: '' }
            setTimeout(() => {
                alert.value = {
                    type: 'error',
                    message: 'Terjadi kesalahan saat menghubungi server!', err
                }
            }, 10)
        }
    }
    
    async function handleDelete(productId) {
        if (!confirm('Yakin ingin hapus produk ini?')) return
        try {
            await axios.delete(`${API_URL}products/${productId}`, {
                withCredentials: true
            })
            await loadProduct()
            alert.value = { type: '', message: '' }
            setTimeout(() => {
                alert.value = {
                    type: 'success',
                    message: 'Berhasil hapus data!'
                }
            }, 10)
        } catch (err) {
            console.error('Error saat hapus produk:', err.response?.data || err.message)
            alert.value = { type: '', message: '' }
            setTimeout(() => {
                alert.value = {
                    type: 'error',
                    message: 'Terjadi kesalahan saat menghubungi server!', err
                }
            }, 10)

        }
    }

    async function submitBulkUpdate() {
        const payload = products.value.map(p => ({
            productId: p.productId,
            stock: p.stock
        }))
        try {
            await axios.put(`${API_URL}products/update-stock`, payload, {
                withCredentials: true
            })
            bulkEdit.value = false
            await loadProduct()
            alert.value = { type: '', message: '' }
            setTimeout(() => {
                alert.value = {
                    type: 'success',
                    message: 'berhasil update produk!'
                }
            }, 10)
        } catch (err) {
            console.error('Error saat update stock:', err.response?.data || err.message)
            alert.value = { type: '', message: '' }
            setTimeout(() => {
                alert.value = {
                    type: 'error',
                    message: 'Terjadi kesalahan saat menghubungi server!', err
                }
            }, 10)
        }
    }

    const filteredProducts = computed(() => {
        return products.value.filter(p => {
            const matchName = p.productName.toLowerCase().includes(searchQuery.value.toLowerCase())
            const matchCategory = selectedCategory.value ? p.category === selectedCategory.value : true
            return matchName && matchCategory
        })
    })

    const totalPage = computed(() => {
        return Math.ceil(filteredProducts.value.length / perPage)
    })
    
    const paginateProducts = computed(() => {
        const start = (currentPage.value - 1) * perPage
        const end = start + perPage
        return filteredProducts.value.slice(start, end)
    })

    function changePage(page) {
        if (page >= 1 && page <= totalPage.value) {
            currentPage.value = page
        }
    }

    function goBack(){
        router.back()
    }
</script>