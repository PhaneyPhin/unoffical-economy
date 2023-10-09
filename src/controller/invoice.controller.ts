import { KafkaMessage } from "kafkajs";
import { producer } from "../producer";
import { VALIDATION_DONE_TOPIC, VALIDATION_RESPONSE_SCHEMA_ID } from "../config";
import registry from "../schemaRegistry";
import { Invoice, ProcessInvoiceData } from "../interface/invoice";
import cache from "../utils/cache";
import { ValidationError } from "../interface/Error";
import { validateSchema } from "../JoiSchema/validateInvoice";
import { simplifyErrors } from "../utils/simplifyError";
import Topic from "../enums/TOPIC";

export class InvoiceController {
  public doValidateInvoice = (invoice: Invoice) : ValidationError[] | null => {
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

  async validateInvoice(processInvoiceData: ProcessInvoiceData, message: KafkaMessage) {
    let validate = this.doValidateInvoice(processInvoiceData.data)

    if (validate) {
      const encodedPayload = await registry.encode(VALIDATION_RESPONSE_SCHEMA_ID, {
        process_id: processInvoiceData.process_id,
        isError: true,
        data: validate
      })

      producer.send({
        topic: Topic.PROCESS_INVOICE_REPLY,
        messages: [
          {
            value: encodedPayload
          }
        ]
      })
    } else {
      producer.send({
        topic: VALIDATION_DONE_TOPIC,
        messages: [message]
      })
    }
  }
}