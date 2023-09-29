import { validateSchema } from "../../src/JoiSchema/validateInvoice"; // Replace with the actual path
import { describe, test, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { AVAILABLE_CURRENCY } from "../../src/config";

describe("Validation Schema", () => {
  test("Valid static data", () => {
    const invoice = {
      invoice_id: 'INV-0012344',
      buyer_name: "Phaney Phin",
      buyer_vat_tin: "1234-058991820",
      buyer_address: "Phnom Penh",
      buyer_phone: "0889549645",
      invoice_currency: "KHR",
      seller_name: "Phaney",
      seller_address: "Phnom Penh",
      invoice_items: [
        {
          item_id: "15",
          item_name: "string",
          item_description: "aa",
          item_quantity: 10,
          item_unit_price: 10,
        },
      ],
      sub_total_amount: 100,
    };

    const result = validateSchema.validate(invoice);

    expect(result?.error).toBeUndefined();
  });

  test("Valid Data", () => {
    const data = {
      invoice_id: 'INV-'+ faker.number,
      buyer_name: faker.person.fullName(),
      buyer_vat_tin:
        faker.number.int({ min: 1000, max: 9999 }) +
        "-" +
        faker.number.int({ min: 100000000, max: 999999999 }),
      buyer_address: faker.location.streetAddress(),
      buyer_phone: faker.phone.number(),
      invoice_currency: AVAILABLE_CURRENCY[1],
      seller_name: faker.company.name(),
      seller_address: faker.location.streetAddress(),
      invoice_items: [
        {
          item_id: "122",
          item_name: faker.commerce.productName(),
          item_description: faker.lorem.sentence(),
          item_quantity: faker.number.int({ min: 1, max: 10 }),
          item_unit_price: faker.number.int({ min: 1, max: 100 }),
        },
      ],
      sub_total_amount: 100,
    };

    const result = validateSchema.validate(data);

    expect(result.error).toBeUndefined();
  });

  test("Invalid VAT TIN Format", () => {
    const data = {
      buyer_name: "John Doe",
      buyer_vat_tin: "12345", // Invalid VAT TIN format
    };

    const result = validateSchema.validate(data);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain(
      'Buyer VAT TIN must be in the format "1234-058991820".'
    );
  });

  test("Invalid Currency", () => {
    const data = {
      invoice_currency: "AUD",
    };

    const result = validateSchema.validate(data);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain(
      '"invoice_currency" must be one of [' +
        AVAILABLE_CURRENCY.join(", ") +
        "]."
    );
  });

  test("Missing All Required Fields", () => {
    const data = {}; // No fields provided

    const result = validateSchema.validate(data);
    expect(result.error).toBeDefined();
    expect(result.error?.details).toHaveLength(10); // Assuming there are 8 required fields
    expect(result.error?.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ["buyer_name"] }),
        expect.objectContaining({ path: ["buyer_vat_tin"] }),
        expect.objectContaining({ path: ["buyer_address"] }),
        expect.objectContaining({ path: ["buyer_phone"] }),
        expect.objectContaining({ path: ["invoice_currency"] }),
        expect.objectContaining({ path: ["seller_name"] }),
        expect.objectContaining({ path: ["seller_address"] }),
        expect.objectContaining({ path: ["invoice_items"] }),
      ])
    );
  });
});
