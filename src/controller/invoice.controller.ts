import { KafkaMessage } from "kafkajs";
import { producer } from "../producer";
import { PROCESS_INVOICE_REPLY_TOPIC, VALIDATION_DONE_TOPIC, VALIDATION_RESPONSE_SCHEMA_ID } from "../config";
import registry from "../schemaRegistry";
import { Invoice } from "../interface/invoice";
import cache from "../utils/cache";
import { ValidationError } from "../interface/Error";
import { validateSchema } from "../JoiSchema/validateInvoice";
import { simplifyErrors } from "../utils/simplifyError";
type ValidationFunction = (invoice: Invoice) => ValidationError[] | null
interface DecodedPayload {
  process_id: number,
  data: Invoice
}
export class InvoiceController {
  public doValidateInvoice: ValidationFunction = (invoice: Invoice) => {
    const invoiceString = JSON.stringify(invoice)
  
    if (cache.get(invoiceString)) {
        const duplicatedError: ValidationError[] = [
          {
            message: 'Invoice was duplicated',
            path: '',
            type: 'duplicated',
          }
        ]
  
        return duplicatedError
  
    }
  
    const validated = validateSchema.validate(invoice)
    
    if (validated.error) {
      return simplifyErrors(validated?.error);
    }
  
    cache.set(invoiceString, true)
  
    return null
  };

  async validateInvoice(message: KafkaMessage) {
    if (! message?.value) {
      return ''
    }

    const decodedPayload = await registry.decode(message.value) as DecodedPayload
    let validate = this.doValidateInvoice(decodedPayload.data)

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