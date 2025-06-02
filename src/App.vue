<script setup>
    import ProductList from './components/ProductList.vue'
    import Checkout from './components/Checkout.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="text-xl font-bold text-indigo-600">
          POS App
        </div>
        <div class="space-x-6">
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-indigo-600 font-semibold transition"
            active-class="text-indigo-600 border-b-2 border-indigo-600"
            exact
          >
            Beranda
          </router-link>
          <router-link 
            to="/checkout" 
            class="text-gray-700 hover:text-indigo-600 font-semibold transition"
            active-class="text-indigo-600 border-b-2 border-indigo-600"
          >
            Checkout
          </router-link>
        </div>
      </div>
    </nav>

    <main class="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
      <router-view />
    </main>

    <footer class="bg-white shadow-inner mt-auto py-4 text-center text-gray-500 text-sm">
      &copy; 2025 POS App. All rights reserved.
    </footer>
  </div>
</template>

<style scoped>
/* Jika mau custom active-class pada router-link,
   bisa gunakan Tailwind class seperti di atas atau custom CSS */
</style>
