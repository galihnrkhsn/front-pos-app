<!-- src/components/ui/Modal.vue -->
<template>
    <div class="fixed inset-0 z-50 bg-black bg-gray-500/80 flex items-center justify-center">
        <div class="bg-white w-full max-w-md rounded-lg shadow p-6">
            <div class="flex justify-between items-center border-b pb-2 mb-4">
                <h3 class="text-lg font-semibold">
                   <slot name="header" />
                </h3>
                <button @click="$emit('close')" class="text-gray-600 hover:text-red-600 text-xl">&times;</button>
            </div>

            <div class="mb-4">
                <slot name="body" />
            </div>

            <div class="flex justify-end gap-2">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>
