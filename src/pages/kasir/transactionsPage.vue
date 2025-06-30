<template>

</template>
<script setup>
    import axios from 'axios';
    import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import AlertMessage from '../../components/AlertMessage.vue';

    const alert         = ref({ type: '', message })
    const transactions  = ref([])
    const loading       = ref(true)
    const API_URL       = 'http://localhost/project/pos-app/public/'
    const router        = useRouter()

    onMounted(() => {
        loadTransaction()
    })

    async function loadTransaction(){
        loading.value = true
        try {
            const response = await axios.get(`${API_URL}transactions`, {
                withCredentials: true
            })
            transactions.value = response.data.data
        } catch (err) {
            a
        } finally {

        }
    }
</script>