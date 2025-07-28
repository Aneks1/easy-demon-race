<template>
    <div class="demon-card">
        <div class="demon-info">
            <div class="demon-title">
                {{ `#${position} - ${demon.name}` }}
            </div>
            <div class="demon-subtitle">
                {{ `By ${demon.author}` }}
            </div>
            <div class="demon-subtitle">
                {{ `ID: ${demon.id}` }}
            </div>
        </div>
        <button @click="complete()" v-if="!completed">Complete</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'DemonCard',
    props: {
        demon: {
            type: Object,
            required: true
        },
        position: Number
    },
    data() {
        return {
            completed: false
        }
    },
    methods: {
        complete() {
            this.completed = true
            this.$emit('next')
        }
    }
})
</script>

<style scoped>
@import url("./styles.css");
</style>