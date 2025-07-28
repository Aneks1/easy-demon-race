<template>
  <info-bar-vue @start="start()" :completed="completed" :best="best"/>
 <Box class="bg-accent-2">Hola</Box>
  <div class="main">
        <div class="title">
            Easy Demon Race
        </div>
        <div class="demons-container">
            <demon-card-vue
                v-for="(demon, i) in demonList"
                :key="i"
                :position="i + 1"
                :demon="demon"
                @next="next()"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DemonCardVue from './components/DemonCard/DemonCard.vue'
import InfoBarVue from './components/InfoBar/InfoBar.vue'
import Demon from './utils/Demon'
import getRandomDemon from './utils/getDemon'

export default defineComponent({
    components: { InfoBarVue, DemonCardVue },
    data() {
        return {
            demonList: [] as Demon[],
            completed: 0,
            best: 0
        }
    },
    methods: {
        async start() {
            this.demonList = []
            await this.getDemon()
        },
        async getDemon() {
            const demon = await getRandomDemon()
            if(!demon) {
                window.alert("Rate limited! Please wait a second")
                this.getDemon()
                return
            }
            this.demonList.push(demon)
        },

        async next() {
            this.completed++
            await this.getDemon()
            if(this.completed > this.best) this.best = this.completed
        }
    },
    mounted() {
        this.best = localStorage.getItem('best') ? parseInt(localStorage.getItem('best') as string) : 0
    }
})
</script>


<style>
@import url("./assets/main.css");
</style>
