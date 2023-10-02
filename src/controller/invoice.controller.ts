import { KafkaMessage } from "kafkajs";
import { InvoiceSchemaType } from "../schema/invoice-schema.avro";
import { Invoice } from "../interface/invoice";
import { validateInvoice } from "../validate-invoice";
import { producer } from "../producer";
import { PROCESS_INVOICE_REPLY_TOPIC, VALIDATION_DONE_TOPIC } from "../config";
import { ResponseSchema } from "../schema/response-schema.avro";

export class InvoiceController {
    async validateInvoice(message: KafkaMessage)
    {
        if (! message?.value) {
            return ''
        }

        const payload: any = InvoiceSchemaType.fromBuffer(message.value);
        const validate = validateInvoice(payload.data)
   
        console.log(validate)
        if (validate) {
          producer.send({
           topic: PROCESS_INVOICE_REPLY_TOPIC,
           messages: [
             {
               value: ResponseSchema.toBuffer({
                 process_id: payload.process_id,
                 isError: true,
                 data: validate
              })
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