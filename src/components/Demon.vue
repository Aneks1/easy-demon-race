<template>
    <div id="demon-container">
        <span id="demon-title">#{{ position }} - {{ demon.name }}</span>
        <span id="demon-info">
            By {{ demon.author }}
            <br>ID: {{ demon.id }}
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'DemonComp',
    props: {
        demon: {
            type: Object,
            required: true,
        },
        position: {
            type: Number,
            required: true
        }
    }
})
</script>

<style scoped>
    #demon-container {
        width: 100%;
        height: 7rem;
        background: none;
        background-image: linear-gradient(to bottom right, rgba(19, 18, 90, 0.313), rgba(106, 31, 123, 0.352));
        border-radius: 7.5px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }
    #demon-title {
        font-size: 30px;
    }
    #demon-info {
        font-size: 18px;
        line-height: 20px;
    }
</style>