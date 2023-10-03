import { KafkaMessage } from "kafkajs";
import { validateInvoice } from "../validate-invoice";
import { producer } from "../producer";
import { PROCESS_INVOICE_REPLY_TOPIC, VALIDATION_DONE_TOPIC, VALIDATION_RESPONSE_SCHEMA_ID } from "../config";
import registry from "../schemaRegistry";

export class InvoiceController {
    async validateInvoice(message: KafkaMessage)
    {
        if (! message?.value) {
            return ''
        }

        const decodedPayload = await registry.decode(message.value)
        const validate = validateInvoice(decodedPayload.data)
   
        if (validate) {
          const encodedPayload = await registry.encode(VALIDATION_RESPONSE_SCHEMA_ID, {
            process_id: decodedPayload.process_id,
            isError: true,
            data: validate
         })
          producer.send({
           topic: PROCESS_INVOICE_REPLY_TOPIC,
           messages: [
             {
               value: encodedPayload
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