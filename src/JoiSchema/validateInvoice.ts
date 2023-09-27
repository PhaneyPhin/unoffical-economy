import Joi from "joi";

export const validateSchema = Joi.object({
    buyer_name: Joi.string().required(),
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
    invoice_currency: Joi.string().required(),
    seller_name: Joi.string().required(),
    seller_address: Joi.string().required(),
    invoice_items: Joi.array().items(
      Joi.object({
        item_name: Joi.string().required(),
        item_description: Joi.string().required(),
        item_quantity: Joi.number().greater(0).required(),
        item_unit_price: Joi.number().greater(0).required(),
      })
    ).min(1).required(),
}).options({ abortEarly: false });