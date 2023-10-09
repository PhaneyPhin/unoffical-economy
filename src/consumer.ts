import { GROUP_ID } from "./config";
import { kafka } from "./kafka";
import { InvoiceController } from "./controller/invoice.controller";
import Topic, { LISTEN_TOPIC } from "./enums/TOPIC";
import registry from "./schemaRegistry";
import { ProcessInvoiceData } from "./interface/invoice";
const invoiceController = new InvoiceController()

export const consumeMessage = async () => {
  const consumer = kafka.consumer({ groupId: GROUP_ID });
  await consumer.connect();
  await consumer.subscribe({ topics: LISTEN_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (message.value) {
        const invoiceData: ProcessInvoiceData = await registry.decode(message.value)
        
        switch(topic) {
          case Topic.PROCESS_INVOICE:
            invoiceController.validateInvoice(invoiceData, message)
            break
       }
      }
    },
  });
};
