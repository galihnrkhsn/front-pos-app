<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold text-center mb-6">Register</h2>

            <form @submit.prevent="handleRegister">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Nama</label>
                    <input v-model="name" type="text" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input v-model="email" type="email" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input v-model="password" type="password" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>

                <button type="submit" class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                Register
                </button>
            </form>

            <p class="text-center text-sm text-gray-600 mt-4">
                Sudah punya akun?
                <router-link to="/" class="text-blue-500 hover:underline">Login</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    const name = ref('')
    const email = ref('')
    const password = ref('')

    function handleRegister() {
        console.log('Register dengan:', name.value, email.value, password.value)
    }
</script>