<template>
    <div class="flex justify-center items-center gap-2 mt-6">
        <button
            @click="$emit('change', current - 1)"
            :disabled="current === 1"
            class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
        >
            &laquo;
        </button>

        <button
            v-for="page in total"
            :key="page"
            @click="$emit('change', page)"
            :class="[
            'px-3 py-1 rounded',
            current === page
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            ]"
        >
            {{ page }}
        </button>

        <button
            @click="$emit('change', current + 1)"
            :disabled="current === total"
            class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
        >
            &raquo;
        </button>
    </div>
</template>
<script setup>
    defineProps({
        current: Number,
        total: Number
    })

    defineEmits(['change'])
</script>