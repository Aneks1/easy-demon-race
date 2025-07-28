import axios from "axios"
import Demon from "./Demon"

export default async function getRandomDemon(): Promise<Demon | null> {
    const randomPage = Math.floor(Math.random() * (204 + 1))
    const randomResult = Math.floor(Math.random() * (10 + 1))

    const res = await axios.get(`https://gdbrowser.com/api/search/*?diff=-2&demonFilter=1&page=${randomPage}`)
    const level: Record<string, string> = res.data[randomResult]

    if(!level) return null
    return { name: level.name, author: level.author, id: level.id }
}