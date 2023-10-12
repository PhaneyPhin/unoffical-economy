import { validateSchema } from "../../src/requests/validateInvoice"; // Replace with the actual path
import { describe, test, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { AVAILABLE_CURRENCY } from "../../src/config";
import { InvoiceDetails } from "../../src/requests/invoice.request";

describe('InvoiceDetails Schema Validation', () => {
  test('Valid Invoice Details', () => {
    const validInvoiceDetails = {
      due_date: "2023-11-11",
      buyer_reference: "Example Business (English)",
      buyer_vat_tin: "1234-058991820",
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

    const result = InvoiceDetails.validate(validInvoiceDetails);
    console.log(result.error)
    expect(result.error).toBeUndefined();
    expect(result.value).toEqual(validInvoiceDetails);
  });
});

describe('InvoiceDetails Schema Validation - All Not Null Fields Missing or Null', () => {
  test('Invalid Invoice Details - All Not Null Fields Missing or Null', () => {
    const invalidInvoiceDetails = {
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

    const result: any = InvoiceDetails.validate(invalidInvoiceDetails, { abortEarly: false });

    // Ensure that the validation result contains errors
    expect(result.error).toBeDefined();

    // Print the validation errors for manual inspection
    console.log(result.error.details);

    // Optionally, you can check specific error messages for each missing or null field
    const notNullFields = ["buyer_vat_tin", "invoice_lines", "sub_total"];
    notNullFields.forEach(field => {
      expect(result.error.details.some((detail: any) => detail.message.includes(field))).toBe(true);
    });
  });
});