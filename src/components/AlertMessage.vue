<template>
    <div v-if="visible" :class="['p-3 rounded mb-4', typeClass]" role="alert">
        {{ message }}
    </div>
</template>

<script setup>
    import { ref, watchEffect, computed } from 'vue';

    const props = defineProps({
        type: {type: String, default: 'success'},
        message: {type: String, required: true},
        duration: {type: Number, default: 3000}
    })

    const visible = ref(true)
    const typeClass = computed(() => {
        return props.type === 'success'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
    })

    watchEffect(() => {
        visible.value = true
        setTimeout(() => visible.value = false, props.duration)
    }) 
</script>