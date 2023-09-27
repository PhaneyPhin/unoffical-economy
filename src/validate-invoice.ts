import { producer } from "./producer";
import { VALIDATE_INVOICE_REPLY_TOPIC } from "./config";
import { simplifyErrors } from "./utils/simplifyError";
import { Invoice } from "./interface/invoice";
import { validateSchema } from "./JoiSchema/validateInvoice";
import { InvoiceSchemaType } from "./schema/invoice-schema.avro";
import { ResponseSchema } from "./schema/response-schema.avro";

export const validateInvoice = (payload: Buffer) => {
  const invoice: Invoice = InvoiceSchemaType.fromBuffer(payload);

  const validated = validateSchema.validate(invoice, {
    abortEarly: false,
  })
  
  if (validated.error) {
    const errors = simplifyErrors(validated?.error)

    producer.send({
        topic: VALIDATE_INVOICE_REPLY_TOPIC,
        messages: [
          {
            value: ResponseSchema.toBuffer({ 
                isError: true,
                data: errors
            }),
          },
        ],
      });
  } else {
    producer.send({
        topic: VALIDATE_INVOICE_REPLY_TOPIC,
        messages: [
          {
            value: ResponseSchema.toBuffer({ 
                isError: false,
                data: []
            }),
          },
        ],
      });
  }
};
