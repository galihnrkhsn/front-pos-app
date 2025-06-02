<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-900">POS App</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="border rounded p-4 flex justify-between items-center"
      >
        <div>
          <p class="font-semibold text-gray-800">{{ product.name }}</p>
          <p class="text-gray-600">Rp{{ product.price.toLocaleString() }}</p>
        </div>
        <button 
          @click="cart.add(product)"
          class="bg-indigo-600 text-white rounded px-3 py-1 hover:bg-indigo-700 transition"
        >
          +
        </button>
      </div>
    </div>

    <Cart />
  </div>
</template>

<script setup>
    import Cart from '../components/Cart.vue'
    import { useCartStore } from '../stores/cart'

    const cart = useCartStore()
    const products = [
        { id: 1, name: 'T-Shirt', price: 10000 },
        { id: 2, name: 'Shirt', price: 15000 },
        { id: 3, name: 'Pants', price: 20000 },
    ]
</script>