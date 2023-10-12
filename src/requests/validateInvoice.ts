import Joi, { CustomHelpers } from "joi";
import { AVAILABLE_CURRENCY } from "../config";
// import { validateTotal } from "../utils/validator";

export const validateSchema = {
  validate: (object: any) => {
    const schema = Joi.object({
      invoice_id: Joi.string().required(),
      issued_date: Joi.string().optional(),
      note: Joi.string().optional(),
      buyer_vat_tin: 
        Joi.string()
        .required()
        .custom(function (value, helper) {
            if (! object.buyer) {
               return helper.error('does_not_exist')
            }

            return value
        })
        .required()
        .messages({
          'does_not_exist': 'Buyer vat tin doesn\'t exist in E-invoicing system.'
        }),
      invoice_currency: Joi.string()
        .valid(...AVAILABLE_CURRENCY)
        .required(),
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
      sub_total: Joi.number()
        .greater(0)
        .required()
        .custom((value: number, helper: CustomHelpers) => {
          // if (! validateTotal(value, object?.invoice_items)) {  
          //   return helper.error('sub_total')
          // }

          return value
        }).messages({
          'sub_total': 'The sub total and the prices line items doesn\'t match.'
        }),
    }).options({ abortEarly: false }).unknown(true);

    return schema.validate(object);
  },
};
