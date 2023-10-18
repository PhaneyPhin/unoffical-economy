import { KafkaMessage } from "kafkajs";
import { producer } from "../services/producer";
import { INVOICE_PROCESS_SCHEMA_ID, VALIDATION_DONE_TOPIC, VALIDATION_RESPONSE_SCHEMA_ID } from "../config";
import registry from "../services/schemaRegistry";
import { BatchInvoiceData, Invoice, ProcessBatchInvoiceData, ProcessInvoiceData } from "../interface/invoice";
import cache from "../utils/cache";
import { ValidationError } from "../interface/Error";
import { simplifyErrors } from "../utils/simplifyError";
import { Topic } from "../enums/topic";
import { InvoiceValidator } from "../requests/invoice.request";

export class InvoiceController {
  async validateInvoice(processInvoiceData: ProcessInvoiceData, message: KafkaMessage) {
    if (! processInvoiceData.invoice.customer) {
      return [
        {
          message: 'Buyer vat tin doesn\'t exist in E-invoicing system.',
          path: '',
          type: 'duplicated',
        }
      ]
    }

    let validated = this.doValidateInvoice(processInvoiceData.invoice)

    if (validated) {
      const encodedPayload = await registry.encode(VALIDATION_RESPONSE_SCHEMA_ID, {
        process_id: processInvoiceData.process_id,
        isError: true,
        data: validated
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

  async validateBatchInvoice(processInvoiceData: ProcessBatchInvoiceData, message: KafkaMessage) {
    let validated = this.doValidateBatchInvoices(processInvoiceData.data)

    if (validated) {
      const encodedPayload = await registry.encode(VALIDATION_RESPONSE_SCHEMA_ID, {
        process_id: processInvoiceData.process_id,
        isError: true,
        data: validated
      })

      await producer.send({
        topic: Topic.PROCESS_BATCH_INVOICE_REPLY,
        messages: [
          {
            value: encodedPayload
          }
        ]
      })
    } else {
      processInvoiceData.data.invoices.forEach(async (invoice) => {
        const encodedPayload = await registry.encode(INVOICE_PROCESS_SCHEMA_ID, {
          process_id: processInvoiceData.process_id,
          data: {
            ...invoice,
            customer: processInvoiceData.data.customer,
            supplier: processInvoiceData.data.supplier
          }
        })
        await producer.send({
          topic: VALIDATION_DONE_TOPIC,
          messages: [{
            value: encodedPayload
          }]
        })
      })
    }
  }

  public doValidateInvoice = (invoice: Partial<Invoice>) : ValidationError[] | null => {
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
  
    const validated = InvoiceValidator.validate(invoice)
    
    if (validated.error) {
      return simplifyErrors(validated?.error);
    }
  
    cache.set(invoiceString, true)
  
    return null
  };

  public doValidateBatchInvoices = (data: BatchInvoiceData) => {
    const invoiceString = JSON.stringify(data)

    if (! data.customer) {
      return [
        {
          message: 'Buyer vat tin doesn\'t exist in E-invoicing system.',
          path: '',
          type: 'duplicated',
        }
      ]
    }

    if (cache.get(invoiceString)) {
        const duplicatedError: ValidationError[] = [
          {
            message: 'Batches Invoice was duplicated',
            path: 'buyer_vat_tin',
            type: 'doesnt_exist',
          }
        ]
  
        return duplicatedError
    }

    let validated: any = []
    data.invoices.forEach((invoice, index) => {
      const validatedItem = InvoiceValidator.validate(invoice)
      if (validatedItem.error) {
        const errors = simplifyErrors(validatedItem?.error)?.map((error) => ({
          message: error.message,
          path: `invoices.${index}.${error.path}`,
          type: error.type
        }));

        validated = [...validated, ...errors]
      } else {  
        return null
      }
    })

    if (validated?.length) {
      return validated
    }
  
    cache.set(invoiceString, true)
  
    return null
  };

}