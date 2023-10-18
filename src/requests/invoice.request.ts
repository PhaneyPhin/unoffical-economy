import Joi from "joi";
import { Invoice, InvoiceLine } from "../interface/invoice";
import { AVAILABLE_CURRENCY } from "../config";

const TaxCategoryValidator = Joi.object({
  id: Joi.string().required().not(null),
  percent: Joi.number().required().not(null).greater(0).less(100),
  tax_scheme: Joi.string().required().not(null),
}).options({ presence: 'required' });

const ItemValidator = Joi.object({
  description: Joi.string().allow(null),
  name: Joi.string().required().not(null),
  tax_categories: Joi.array().items(TaxCategoryValidator).allow(null),
});

export const InvoiceLineValidator = Joi.object({
  id: Joi.string().required().not(null),
  quantity_unit_code: Joi.string().required().not(null),
  quantity: Joi.number().required().required().not(null),
  line_extension_amount: Joi.number().required().not(null).custom((value, helpers) => {
    let invoiceLine: InvoiceLine = helpers.state.ancestors[0];

    const expectedAmount = invoiceLine.price * invoiceLine.quantity;
    if (value !== expectedAmount) {
      return helpers.error('any.invalid');
    }

    return value;
  }),
  price: Joi.number().required().not(null),
  item: ItemValidator.required().not(null),
}).options({ abortEarly: false});

export const AllowanceChargeValidator = Joi.object({
  charge_indicator: Joi.boolean().default(true),
  reason: Joi.string().allow(null),
  amount: Joi.number().required().not(null),
  tax_categories: Joi.array().items(TaxCategoryValidator).allow(null),
});

const CustomerSupplier = Joi.object({
  id: Joi.number().allow(null),
  business_single_id: Joi.string().allow(null),
  business_name_en: Joi.string().allow(null),
  business_name_km: Joi.string().allow(null),
  business_vat_tin: Joi.string().allow(null),
  invoice_webhook: Joi.string().uri().allow(null),
});

export const InvoiceValidator = Joi.object({
  due_date: Joi.string().allow(null),
  buyer_reference: Joi.string().allow(null),
  buyer_vat_tin: Joi.string().optional().allow(null),
  allowance_charges: Joi.array().items(AllowanceChargeValidator).allow(null),
  exchange_rate: Joi.number().allow(null),
  currency: Joi.required().valid(...AVAILABLE_CURRENCY),
  invoice_lines: Joi.array().items(InvoiceLineValidator).length(1),
  // supplier: CustomerSupplier.allow(null).optional(),
  // customer: CustomerSupplier.allow(null).optional(),
  sub_total: Joi.number().required().not(null).custom(function (value, helper) {
    const invoice: Invoice = helper.state.ancestors[0]

    if (invoice.invoice_lines?.length) {
      let expectedValue = invoice.invoice_lines?.reduce((total, invoiceLine) => {
        return total + invoiceLine.line_extension_amount
      }, 0) || 0

      if (invoice.allowance_charges?.length) {
        const allowanceChargeTotal = invoice.allowance_charges.reduce((total, allowanceChage) => {
          return total + allowanceChage.amount
        }, 0) || 0

        expectedValue += allowanceChargeTotal
      }

      if (value !== expectedValue) {
        return helper.error('any.invalid')
      }
    }

    return value;
  }),
}).unknown(true).options({ presence: 'required', abortEarly: false });
