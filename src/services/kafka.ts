import { Kafka, KafkaConfig } from 'kafkajs';
import { CLIENT_ID, KAFKA_BROKER } from '../config';

const kafkaConfig: KafkaConfig = {
  clientId: CLIENT_ID,
  brokers: [KAFKA_BROKER],
}

export const kafka = new Kafka(kafkaConfig)
