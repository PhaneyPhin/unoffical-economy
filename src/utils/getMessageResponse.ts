import { eventEmitter } from "../EventEmitter"

export const getMessageResponse = (topic: string) => {
    return new Promise((resolve, reject) => {
        eventEmitter.on(topic, (data) => {
        resolve(data)
        })
    })
}