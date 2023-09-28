import { simplifyErrors } from "./utils/simplifyError";
import { Invoice } from "./interface/invoice";
import { validateSchema } from "./JoiSchema/validateInvoice";
import cache from "./utils/cache";
import { ValidationError } from "./interface/Error";

type ValidationFunction = (invoice: Invoice) => ValidationError[] | null

export const validateInvoice: ValidationFunction = (invoice: Invoice) => {
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

  const validated = validateSchema.validate(invoice, {
    abortEarly: false,
  })
  
  if (validated.error) {
    return simplifyErrors(validated?.error);
  }

  cache.set(invoiceString, true)

  return null
};
