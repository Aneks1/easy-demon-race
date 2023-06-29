<template>
    <div id="pause-menu">
        <div id="menu">
            <span style="font-size: 60px; font-weight: bold;">Pause</span>
            <div id="menu-buttons">
                <button class="menu-btn" @click="$emit('continue')">Continue</button>
                <button class="menu-btn" @click="$emit('save')">Save</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #pause-menu {
        width: 100vw;
        height: 100vh;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
    }
    #menu {
        height: 85%;
        width: 40%;
        background: rgb(39, 39, 39);
        background-image: linear-gradient(to bottom right, rgba(19, 18, 90, 0.313), rgba(106, 31, 123, 0.352));
        border-radius: 15px;
        box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10vh;
    }
    #menu-buttons {
        display: flex;
        flex-direction: column;
        gap: 2vh;
    }
    .menu-btn {
        height: 4rem;
        width: 8rem;
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.105);
        color: white;
        font-size: 17px;
        background: none;
        background-image: linear-gradient(to bottom right, rgba(116, 0, 139, 0.163), rgba(0, 160, 196, 0.141));
        backdrop-filter: blur(10px);
        box-shadow: 7px 7px 18px rgba(0, 0, 0, 0.538);
    }
    .menu-btn:hover {
        background-image: linear-gradient(to bottom right, rgba(139, 0, 167, 0.356), rgba(0, 160, 196, 0.249));
    }
</style>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'PauseMenu',
})
</script>
