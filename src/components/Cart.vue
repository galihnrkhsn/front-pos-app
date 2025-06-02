<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Keranjang</h2>

    <div v-if="cart.items.length === 0" class="text-center text-gray-500 py-8">
      Keranjang Kosong
    </div>

    <ul v-else class="divide-y divide-gray-200">
      <li 
        v-for="item in cart.items" 
        :key="item.id" 
        class="flex justify-between items-center py-3"
      >
        <div>
          <p class="font-medium text-gray-700">{{ item.name }}</p>
          <p class="text-sm text-gray-500">
            {{ item.qty }} x Rp{{ item.price.toLocaleString() }} = Rp{{ (item.qty * item.price).toLocaleString() }}
          </p>
        </div>
        <button 
          @click="cart.remove(item.id)" 
          class="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded border border-red-500 hover:bg-red-100 transition"
        >
          Hapus
        </button>
      </li>
    </ul>

    <p class="mt-6 text-lg font-semibold text-gray-900">
      Total: Rp{{ cart.totalPrice.toLocaleString() }}
    </p>

    <router-link to="/checkout" class="block mt-4">
      <button 
        :disabled="cart.items.length === 0"
        class="w-full bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
      >
        Checkout
      </button>
    </router-link>
  </div>
</template>

<script setup>
    import { useCartStore } from '../stores/cart'
    const cart = useCartStore()
</script>