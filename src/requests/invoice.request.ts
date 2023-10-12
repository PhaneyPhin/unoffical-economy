import Joi from "joi";
import { Invoice, InvoiceLine } from "../interface/invoice";

const TaxCategory = Joi.object({
  id: Joi.string().required().not(null),
  percent: Joi.number().required().not(null).greater(0).less(100),
  tax_scheme: Joi.string().required().not(null),
}).options({ presence: 'required' });

const Item = Joi.object({
  description: Joi.string().allow(null),
  name: Joi.string().required().not(null),
  tax_categories: Joi.array().items(TaxCategory).allow(null),
});

const InvoiceLine = Joi.object({
  id: Joi.string().required().not(null),
  quantity_unit_code: Joi.string().allow(null),
  quantity: Joi.number().required().not(null),
  line_extension_amount: Joi.number().required().not(null).custom((value, helpers) => {
    console.log( helpers.state )
    let invoiceLine: InvoiceLine = helpers.state.ancestors[0];

    const expectedAmount = invoiceLine.price * invoiceLine.quantity;
      if (value !== expectedAmount) {
      return helpers.error('any.invalid');
    }
  
    return value;
  }),
  price: Joi.number().required().not(null),
  item: Item.required().not(null),
});

const AllowanceCharge = Joi.object({
  charge_indicator: Joi.boolean().default(true),
  reason: Joi.string().allow(null),
  amount: Joi.number().required().not(null),
  tax_categories: Joi.array().items(TaxCategory).allow(null),
});

const CustomerSupplier = Joi.object({
  id: Joi.number().allow(null),
  business_single_id: Joi.string().allow(null),
  business_name_en: Joi.string().allow(null),
  business_name_km: Joi.string().allow(null),
  business_vat_tin: Joi.string().allow(null),
  invoice_webhook: Joi.string().uri().allow(null),
});

export const InvoiceDetails = Joi.object({
  due_date: Joi.string().allow(null),
  buyer_reference: Joi.string().allow(null),
  buyer_vat_tin: Joi.string().optional().allow(null),
  allowance_charges: Joi.array().items(AllowanceCharge).allow(null),
  exchange_rate: Joi.number().allow(null),
  invoice_lines: Joi.array().items(InvoiceLine).length(1),
  supplier: CustomerSupplier.allow(null).optional(),
  customer: CustomerSupplier.allow(null).optional(),
  sub_total: Joi.number().required().not(null).custom(function(value, helper) {
    const invoice: Invoice = helper.state.ancestors[0]

    if (invoice.invoice_lines?.length) {
      let expectedValue = invoice.invoice_lines?.reduce((total, invoiceLine) => {
        return total + invoiceLine.line_extension_amount
      }, 0) || 0

      if (invoice.allowance_charges?.length) {
        const allowanceChargeTotal =invoice.allowance_charges.reduce((total, allowanceChage) => {
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
}).options({ presence: 'required', abortEarly: false });
