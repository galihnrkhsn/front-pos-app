<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Username</label>
                    <input v-model="name" type="text" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input v-model="password" type="password" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>

                <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Login
                </button>
            </form>

            <p class="text-center text-sm text-gray-600 mt-4">
                Belum punya akun?
            </p>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { login, saveUser } from '../../services/authService'
    import { useRouter } from 'vue-router'

    const name          = ref('')
    const password      = ref('')
    const error         = ref('')
    const router        = useRouter()


    async function handleLogin() {
        try {
            const res = await login(name.value, password.value)
            const user = res.data.user
            saveUser(user)

            if (user.role === 'kasir') router.push('/home')
            else if (user.role === "admin") router.push('/admin')
        } catch (err) {
            error.value = 'Username atau Password salah'
        }
    }
</script>
