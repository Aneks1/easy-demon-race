<template>
    <div class="info-bar">
        <div class="info">
            <div class="info-subtitle">
                {{ `Completed: ${completed}` }}
            </div>
            <div class="info-subtitle">
                {{ `Best Score: ${best}` }}
            </div>
        </div>
        <div class="timer">
            {{ clientData.timer }}
        </div>
        <button @click="start()" :class="!gameData.started ? 'start' : 'pause'">{{ !gameData.started ? 'Start' : 'Give Up' }}</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'InfoBar',
    props: {
        completed: null,
        best: null
    },
    data() {
        return {
            gameData: {
                started: false,
                paused: false,
                timerInterval: null as number | null
            },
            clientData: {
                time: 2*60*60,
                timer: '2:00:00'
            }
        }
    },
    methods: {
        async start() {
            if(!this.gameData.started) {
                this.gameData.started = true
                this.clientData.time = 2*60*60
                this.clientData.timer = '2:00:00'
                this.gameData.timerInterval = this.startTimer()
                this.$emit('start')
            }
            else {
                localStorage.setItem('best', this.best.toString())
                this.gameData.started = false
                clearInterval(this.gameData.timerInterval as number)
            }
        },

        startTimer() {
            return setInterval(() => {
                if(this.gameData.paused) return null

                let hours = Math.floor(this.clientData.time / 60 / 60)
                let minutes = Math.floor(this.clientData.time / 60) % 60
                let seconds = this.clientData.time % 60

                this.clientData.timer = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
                this.clientData.time --
            }, 1000)
        },
    }
})
</script>

<style scoped>
@import url("./styles.css");
</style>