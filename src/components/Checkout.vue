<template>
    <div class="border p-4 rounded mt-4">
        <h2 class="text-xl font-bold">Checkout</h2>
        <div v-for="item in cart.items" :key="item.id" class="flex justify-between">
            <p>{{ item.name }} x{{ item.qty }}</p>
            <p>Rp {{ (item.price * item.qty).toLocaleString() }}</p>
        </div>
        <hr class="my-2">
        <p class="font-bold">Total: Rp {{ cart.total.toLocaleString() }}</p>
        <button @click="pay" class="bg-green-500 text-white px-4 py-2 mt-2 rounded">Bayar</button>
    </div>
</template>

<script setup>
    import { useCartStore } from '../stores/cart.js'

    const cart = useCartStore()

    function pay() {
        alert('Transaksi sebesar Rp ${cart.total.toLocaleString()} berhasil!')
        cart.clear()
    }
</script>