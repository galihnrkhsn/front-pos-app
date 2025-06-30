<script setup>
    defineProps({
        title: String,
        showBack: {
            type: Boolean,
            default: true
        }
    })

    const emit = defineEmits(['back'])

    function handleBack() {
        emit('back')
    }
</script>

<template>
    <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold">{{ title }}</h2>
        <button
            v-if="showBack"
            @click="handleBack"
            class="bg-indigo-300 hover:bg-indigo-500 text-black px-4 py-2 rounded shadow cursor-pointer"
        >
            Kembali
        </button>
    </div>
</template>