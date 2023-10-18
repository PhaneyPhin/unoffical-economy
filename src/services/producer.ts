import { kafka } from "./kafka"

const producer = kafka.producer()
producer.connect()

export { producer }