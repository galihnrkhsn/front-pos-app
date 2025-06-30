<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-gray-500/60 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border border-indigo-100">
        <h3 class="text-xl font-semibold text-indigo-700 mb-4">Tambah Produk Baru</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama Produk</label>
            <input type="text" v-model="form.productName" class="w-full border px-3 py-2 rounded mt-1" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Kategori</label>
            <select v-model="form.category_id" class="w-full border px-3 py-2 rounded mt-1">
              <option disabled value="">Pilih Kategori</option>
              <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
                {{ cat.categoryName }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Harga</label>
              <input type="number" v-model="form.price" class="w-full border px-3 py-2 rounded mt-1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Stok</label>
              <input type="number" v-model="form.stock" class="w-full border px-3 py-2 rounded mt-1" />
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-4">
          <button @click="$emit('close')" class="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
            Batal
          </button>
          <button @click="handleSubmit" class="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white">
            Simpan
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
    import { reactive } from 'vue';

    const props = defineProps({
        show: Boolean,
        categories: Array
    })
    const emit = defineEmits(['close', 'submit'])

    const form = reactive({
        category_id: 0,
        productName: '',
        price: 0,
        stock: 0
    })

    function handleSubmit() {
        if (!form.category_id || !form.productName || !form.price || !form.stock) {
            alert('Semua kolom harus di isi!')
            return
        }

        emit('submit', { ...form })
        Object.assign(form, {
            category_id: 0,
            productName: '',
            price: 0,
            stock: 0
        })
    }
</script>
<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s ease;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }
</style>