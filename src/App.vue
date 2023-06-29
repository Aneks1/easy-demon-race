<template>
    <PauseVue @continue="pause()" @save="saveData()" :style="`display: ${ !paused ? 'none' : 'flex' }`"/>
    <div id="container">
        <div id="title">Easy Demon Challenge</div>
        <div id="child">
            <div id="left">
                <DemonVue
                    v-for="(demon, i) in allDemons"
                    :key="i"
                    :demon="demon"
                    :position="i+1"
                />
            </div>
            <div id="right">
                <div id="right-inside">
                    <span id="timer">{{ timer }}</span>
                    <div id="buttons">
                        <button @click="next()" class="btn" :style="`display: ${ !started ? 'none' : 'unset' }`">Next</button>
                        <button @click="start()" class="btn">{{ !started ? "Start" : "Give Up" }}</button>
                        <button @click="pause()" class="btn" :style="`display: ${ !started ? 'none' : 'unset' }`">Pause</button>
                    </div>
                    <div id="runData">
                        <span style="font-size: 25px">Completed: {{ completed }}</span>
                        <span style="font-size: 25px">Best: {{ best }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import { defineComponent } from 'vue'
    import DemonVue from './components/Demon.vue'
    import PauseVue from './components/Pause.vue'

    export default defineComponent({
        components: {
            DemonVue,
            PauseVue
        },
        data() {
            return {
                interval: 0,
                time: 2 * 60 * 60,
                timer: '2:00:00',
                started: false,
                allDemons: [] as Record<string, string>[],
                completed: 0,
                best: 0,
                paused: false
            }
        },
        mounted() {
            if (typeof(Storage) !== "undefined") {
                if(!localStorage.best) localStorage.best = "0"
                else this.best = parseInt(localStorage.best)
            }
            else console.log('No storage support for browser')
        },
        methods: {
            async start() {
                if(!this.started) {
                    this.started = true
                    this.completed = 0
                    this.allDemons = []
                    this.time = 2 * 60 * 60
                    this.timer = '2:00:00'
                    this.interval = this.updateTimer()
                    await this.getDemon()
                } else {
                    this.started = false
                    clearInterval(this.interval)
                    if(this.completed > this.best) {
                        this.best = this.completed
                        if (typeof(Storage) !== "undefined") localStorage.best = this.best.toString()
                        else console.log('No storage support for browser')
                    }
                    
                }
            },
            updateTimer() {
                return setInterval(() => {
                    if(!this.paused) {
                        if(this.time == 0) { this.timer = 'Time\'s Up!'; return }
                        let hours: number = Math.floor(this.time / 60 / 60)
                        let minutes: number = Math.floor(this.time / 60) % 60
                        let seconds: number = this.time % 60

                        this.timer = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
                        this.time --
                    }
                }, 1000)
            },
            async getDemon() {
                const randomPage = Math.floor(Math.random() * (171 + 1))
                const randomResult = Math.floor(Math.random() * (10 + 1))
                let res
                res = await axios.get(`https://gdbrowser.com/api/search/*?diff=-2&demonFilter=1&page=${randomPage}`)
                const level: Record<string, string> = res.data[randomResult]
                if(!level) {
                    window.alert('Rate limited, try again later.')
                    return true
                }
                this.allDemons.push({ name: level.name, author: level.author, id: level.id })
                return false
            },
            async next() {
                const ratelimited = await this.getDemon()
                if(ratelimited) return
                else this.completed++
            },
            saveData() {
                const data = JSON.stringify({
                    timeRemaining: this.time,
                    demonsCompleted: this.completed,
                    demons: this.allDemons
                })
                const blob = new Blob([data], { type: 'text/json' })
                const fileURL = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = fileURL
                link.setAttribute('download', 'Easy-Demon-Race.edr')
                document.body.appendChild(link)
                link.click()
            },
            pause() {
                if(!this.paused) this.paused = true
                else this.paused = false
            }
        }
    })
</script>

<style>
    @import url("./styles.css");
</style>