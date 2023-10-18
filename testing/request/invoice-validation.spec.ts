import { describe, test, expect } from "@jest/globals";
import { InvoiceValidator } from "../../src/requests/invoice.request";
import cache from "../../src/utils/cache";
import { validInvoiceData } from "../data/valid-invoice";
import { AVAILABLE_CURRENCY } from "../../src/config";

describe('InvoiceValidator Schema Validation', () => {
  beforeEach(() => {
    cache.flushAll()
  })

  test('Valid Invoice Details', () => {
    const validInvoiceValidator = {
      due_date: "2023-11-11",
      buyer_reference: "Example Business (English)",
      buyer_vat_tin: "1234-058991820",
      currency: AVAILABLE_CURRENCY[0],
      allowance_charges: [
        {
          charge_indicator: true,
          reason: "Delivery",
          amount: 10000.00,
          tax_categories: [
            {
              id: "S",
              percent: 10.00,
              tax_scheme: "VAT"
            }
          ]
        }
      ],
      exchange_rate: 4131,
      invoice_lines: [
        {
          id: "1",
          quantity_unit_code: "XBG",
          quantity: 3.00,
          line_extension_amount: 300000.00,
          price: 100000.00,
          item: {
            description: "Coffee bean bag",
            name: "Coffee bean",
            tax_categories: [
              {
                id: "S",
                percent: 10,
                tax_scheme: "VAT"
              }
            ]
          }
        }
      ],
      supplier: {
        id: 1,
        business_single_id: "123456789",
        business_name_en: "Example Business (English)",
        business_name_km: "អាវិតាសហរណ៍ (ខ្មែរ)",
        business_vat_tin: "1234-058991820",
        invoice_webhook: "https://example.com/webhook"
      },
      customer: {
        id: 1,
        business_single_id: "123456789",
        business_name_en: "Example Business (English)",
        business_name_km: "អាវិតាសហរណ៍ (ខ្មែរ)",
        business_vat_tin: "1234-058991820",
        invoice_webhook: "https://example.com/webhook"
      },
      sub_total: 310000.00,
    };

    const result = InvoiceValidator.validate(validInvoiceValidator);
    expect(result.error).toBeUndefined();
    expect(result.value).toEqual(validInvoiceValidator);
  });
});

describe('InvoiceValidator Schema Validation - All Not Null Fields Missing or Null', () => {
  test('Invalid Invoice Details - All Not Null Fields Missing or Null', () => {
    const invalidInvoiceValidator = {
      // Set all fields marked as "not null" to null or missing
      due_date: null,
      buyer_reference: null,
      buyer_vat_tin: null,
      allowance_charges: null,
      exchange_rate: null,
      invoice_lines: null,
      supplier: null,
      customer: null,
      sub_total: null,
    };

    const result: any = InvoiceValidator.validate(invalidInvoiceValidator, { abortEarly: false });

    // Ensure that the validation result contains errors
    expect(result.error).toBeDefined();
    // Optionally, you can check specific error messages for each missing or null field
    const notNullFields = ["invoice_lines", "sub_total", "currency"];
    notNullFields.forEach(field => {
      expect(result.error.details.some((detail: any) => detail.message.includes(field))).toBe(true);
    });
  });
});

// Mock data for a valid invoice
describe('InvoiceValidator', () => {
  test('Valid Invoice', () => {
    const { error, value } = InvoiceValidator.validate(validInvoiceData);

    // No error should be present
    expect(error).toBeUndefined();

    // The validated value should match the input
    expect(value).toEqual(validInvoiceData);
  });

  test('Invalid Invoice - Mismatched sub_total', () => {
    const invalidInvoiceData = {
      ...validInvoiceData,
      sub_total: 200, // Incorrect sub_total value
    };

    const { error } = InvoiceValidator.validate(invalidInvoiceData);

    // An error should be present
    expect(error).toBeDefined();

    // The error should indicate a mismatched sub_total value
    if (error) {
      const { details } = error;
      expect(details[0].message ).toEqual( "\"sub_total\" contains an invalid value");
    }
  });

  test('Invalid Invoice - Mismatched currnecy', () => {
    const invalidInvoiceData = {
      ...validInvoiceData,
      currency: 'AUD', // Incorrect sub_total value
    };

    const { error } = InvoiceValidator.validate(invalidInvoiceData);

    // An error should be present
    expect(error).toBeDefined();

    // The error should indicate a mismatched sub_total value
    if (error) {
      const { details } = error;
      expect(details[0].message ).toEqual( `"currency" must be one of [${AVAILABLE_CURRENCY.join(', ')}]`);
    }
  });
});