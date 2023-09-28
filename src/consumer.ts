import { GROUP_ID, LISTEN_TOPIC, VALIDATE_INVOICE_REPLY_TOPIC, VALIDATE_INVOICE_TOPIC, VALIDATION_DONE_TOPIC } from "./config";
import { Invoice } from "./interface/invoice";
import { kafka } from "./kafka";
import { producer } from "./producer";
import { InvoiceSchemaType } from "./schema/invoice-schema.avro";
import { ResponseSchema } from "./schema/response-schema.avro";
import { validateInvoice } from "./validate-invoice";

export const consumeMessage = async () => {
  const consumer = kafka.consumer({ groupId: GROUP_ID });
  await consumer.connect();
  await consumer.subscribe({ topics: LISTEN_TOPIC, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (message.value) {
        switch(topic) {
          case VALIDATE_INVOICE_TOPIC:
           const invoice: Invoice = InvoiceSchemaType.fromBuffer(message.value);
 
           const validate = validateInvoice(invoice)

           if (validate) {
             producer.send({
              topic: VALIDATE_INVOICE_REPLY_TOPIC,
              messages: [
                {
                  value: ResponseSchema.toBuffer(validate)
                }
              ]
             })
           } else {
            producer.send({
              topic: VALIDATION_DONE_TOPIC,
              messages: [
                {
                  value: message?.value
                }
              ]
            })
           }
       }
      }
      
    },
  });
  console.log('Already consumed')
};
