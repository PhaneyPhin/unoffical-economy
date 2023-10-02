import Joi, { CustomHelpers } from "joi";
import { AVAILABLE_CURRENCY } from "../config";
import { validateTotal } from "../utils/validator";

export const validateSchema = {
  validate: (object: any) => {
    const schema = Joi.object({
      invoice_id: Joi.string().required(),
      buyer_name: Joi.string().required(),
      issued_date: Joi.string().optional(),
      note: Joi.string().optional(),
      buyer_vat_tin: Joi.string()
        .pattern(/^\d{4}-\d{9}$/)
        .messages({
          "string.pattern.base":
            'Buyer VAT TIN must be in the format "1234-058991820".',
          "any.required": "Buyer VAT TIN is required.",
        })
        .custom(function (value, helper) {
          return true;
        })
        .required(),
      buyer_address: Joi.string().required(),
      buyer_phone: Joi.string().required(),
      invoice_currency: Joi.string()
        .valid(...AVAILABLE_CURRENCY)
        .required(),
      seller_name: Joi.string().required(),
      seller_address: Joi.string().required(),
      invoice_items: Joi.array()
        .items(
          Joi.object({
            item_name: Joi.string().required(),
            item_description: Joi.string().optional(),
            item_quantity: Joi.number().greater(0).required(),
            item_unit_price: Joi.number().greater(0).required(),
            classification: Joi.string().optional(),
            quantity_unit_code: Joi.string().optional().default("number"),
            tax_categories: Joi.array()
              .items({
                percent: Joi.number().required(),
                tax_scheme: Joi.string().required(),
              })
              .optional(),
          })
        )
        .min(1)
        .required(),
      sub_total_amount: Joi.number()
        .greater(0)
        .required()
        .custom((value: number, helper: CustomHelpers) => {
          if (! validateTotal(value, object?.invoice_items)) {  
            return helper.error('The sub total and the prices line items doesn\'t match.')
          }

          return true
        }),
    }).options({ abortEarly: false });

    return schema.validate(object);
  },
};
