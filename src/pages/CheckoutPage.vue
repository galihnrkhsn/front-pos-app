<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Checkout</h2>

    <div v-for="item in cart.items" :key="item.id" class="flex justify-between py-2 border-b border-gray-200">
      <p class="text-gray-700">{{ item.name }} x {{ item.qty }}</p>
      <p class="font-semibold text-gray-900">Rp {{ (item.price * item.qty).toLocaleString() }}</p>
    </div>

    <hr class="my-4 border-gray-300" />

    <p class="text-xl font-bold text-gray-900 mb-4">
      Total: Rp {{ cart.totalPrice.toLocaleString() }}
    </p>

    <button 
      @click="pay" 
      class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-semibold"
    >
      Bayar
    </button>
  </div>
</template>


<script setup>
    import { useCartStore } from '../stores/cart'
    import { useRouter } from 'vue-router'

    const cart = useCartStore()
    const router = useRouter()

    function handleCheckout() {
        alert('Pembayaran Berhasil!')
        cart.clean()
        router.push('/')
    }
</script>