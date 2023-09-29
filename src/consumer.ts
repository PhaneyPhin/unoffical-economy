import { GROUP_ID, LISTEN_TOPIC, PROCESS_INVOICE_TOPIC } from "./config";
import { kafka } from "./kafka";
import { InvoiceController } from "./controller/invoice.controller";
const invoiceController = new InvoiceController()

export const consumeMessage = async () => {
  const consumer = kafka.consumer({ groupId: GROUP_ID });
  await consumer.connect();
  await consumer.subscribe({ topics: LISTEN_TOPIC, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (message.value) {
        switch(topic) {
          case PROCESS_INVOICE_TOPIC:
            invoiceController.validateInvoice(message)
            break
       }
      }
      
    },
  });
  console.log('Already consumed')
};
