<script setup>
    import { useRouter, useRoute } from 'vue-router';
    import { computed, ref } from 'vue';
    import { logout, getUser } from './services/authService';
    import { PowerIcon } from '@heroicons/vue/24/outline';

    const user      = ref(getUser())
    const router    = useRouter()
    const route     = useRoute()
    
    const hideLayout = computed(() =>{
        return route.path === '/' || route.path === '/register'
    })

    function handleLogout(){
        logout()
        router.push('/')
    }

    function goHome(){
        router.push('/home')
    }
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <template v-if="!hideLayout">
            <nav class="bg-white shadow-md">
            <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div @click="goHome()" class="cursor-pointer text-xl font-bold text-indigo-600">
                    POS App
                </div>
                <div class="space-x-6">
                <button 
                    @click="handleLogout" 
                    class="ml-4 text-red-600 hover:text-red-700 transition cursor-pointer"
                    title="Logout"
                >
                    <PowerIcon class="w-7 h-7" />
                </button>
                </div>
            </div>
            </nav>
            <main class="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
                <router-view />
            </main>
            
            <footer class="bg-white shadow-inner mt-auto py-4 text-center text-gray-500 text-sm">
                &copy; 2025 POS App. All rights reserved.
            </footer>
        </template>
        <template v-else>
            <main class="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
                <router-view />
            </main>
        </template>
        
    </div>
</template>