<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
    <div
      v-for="product in products"
      :key="product.id"
      class="border rounded-lg shadow-sm p-4 hover:shadow-lg hover:bg-gray-50 transition cursor-pointer"
    >
      <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ product.name }}</h3>
      <p class="text-gray-700 mb-4">Rp. {{ product.price.toLocaleString() }}</p>
      <button 
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold w-full"
        @click="addToCart(product)"
      >
        Tambah
      </button>
    </div>
  </div>
</template>


<script setup>
    import { useCartStore } from '../stores/cart.js'

    const cart = useCartStore()

    const products = [
        { id: 1, name: 'T-shirt', price: 100000 },
        { id: 2, name: 'Shirt', price: 60000 },
        { id: 1, name: 'Pants', price: 80000 },
    ]

    function addToCart(product) {
        cart.add(product)
    }
</script>