import { GROUP_ID, LISTEN_TOPIC, VALIDATE_INVOICE_TOPIC } from "./config";
import { kafka } from "./kafka";
import { validateInvoice } from "./validate-invoice";

export const consumeMessage = async () => {
  const consumer = kafka.consumer({ groupId: GROUP_ID });
  await consumer.connect();
  await consumer.subscribe({ topics: LISTEN_TOPIC, fromBeginning: true });
  console.log('Consuming message', { topics: LISTEN_TOPIC, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      switch(topic) {
         case VALIDATE_INVOICE_TOPIC:
           message.value && validateInvoice(message.value)
      }
    },
  });
  console.log('Already consumed')
};
