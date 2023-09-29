import { describe, test, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { validateInvoice } from '../src/validate-invoice';
import { Invoice } from '../src/interface/invoice';
import { AVAILABLE_CURRENCY } from '../src/config';
import cache from '../src/utils/cache';

const validInvoice: Invoice = {
  buyer_name: faker.person.fullName(),
  buyer_vat_tin: faker.number.int({ min: 1000, max: 9999 }) + '-' + faker.number.int({ min: 100000000, max: 999999999 }),
  buyer_address: faker.location.streetAddress(),
  buyer_phone: faker.phone.number(),
  invoice_currency: AVAILABLE_CURRENCY[0],
  seller_name: faker.company.name(),
  seller_address: faker.location.streetAddress(),
  invoice_items: [
    {
      item_name: faker.commerce.productName(),
      item_description: faker.lorem.sentence(),
      item_quantity: faker.number.int({ min: 1, max: 10 }),
      item_unit_price: faker.number.int({ min: 1, max: 100 }),
    },
  ],
  sub_total_amount: 100
}

describe('Validation Invoice', () => {
  beforeEach(() => {
    cache.flushAll()
  })

  test('Valid static data', () => {
    const invoice = {
      "buyer_name": "Phaney Phin",
      "buyer_vat_tin": "1234-058991820",
      "buyer_address": "Phnom Penh",
      "buyer_phone": "0889549645",
      "invoice_currency": "KHR",
      "seller_name": "Phaney",
      "seller_address": "Phnom Penh",
      "invoice_items": [
        {
          "item_name": "string",
          "item_description": "aa",
          "item_quantity": 10,
          "item_unit_price": 10
        }
      ],
      "sub_total_amount": 100
    }

    const result = validateInvoice(invoice);
    
    expect(result).toBeNull();
  })
  test('Valid Data', () => {
    const result = validateInvoice(validInvoice);
    
    expect(result).toBeNull();
  });

  test('Duplicate invoice Data', () => {
    let result = validateInvoice(validInvoice);
    
    expect(result).toBeNull();
    result = validateInvoice(validInvoice)
    expect(result).not.toBeNull()
    expect(result).toEqual([
      { message: "Invoice was duplicated", path: "", type: "duplicated" },
    ]);

    const data: any = {}
    result = validateInvoice(data)
    expect(result).not.toBeNull()
    expect(cache.get(JSON.stringify(data))).toBeUndefined()
  });

  test('Invalid VAT TIN Format', () => {
    const data: any = {
      buyer_name: 'John Doe',
      buyer_vat_tin: '12345', // Invalid VAT TIN format
    };

    const result = validateInvoice(data);
    expect(result).not.toBeNull();
    if (result) {
      expect(result[0].message).toEqual(
        'Buyer VAT TIN must be in the format "1234-058991820".'
      );
    }
  });

  test('Missing All Required Fields', () => {
    const data: any = {}; // No fields provided

    const result = validateInvoice(data);
    expect(result).toBeDefined();
    expect(result).toHaveLength(9); // Assuming there are 8 required fields
    const expectedErrors = [
      { message: '"buyer_name" is required', path: 'buyer_name', type: 'any.required' },
      { message: 'Buyer VAT TIN is required.', path: 'buyer_vat_tin', type: 'any.required' },
      { message: '"buyer_address" is required', path: 'buyer_address', type: 'any.required' },
      { message: '"buyer_phone" is required', path: 'buyer_phone', type: 'any.required' },
      { message: '"invoice_currency" is required', path: 'invoice_currency', type: 'any.required' },
      { message: '"seller_name" is required', path: 'seller_name', type: 'any.required' },
      { message: '"seller_address" is required', path: 'seller_address', type: 'any.required' },
      { message: '"invoice_items" is required', path: 'invoice_items', type: 'any.required' },
      { message: '"sub_total_amount" is required', path: 'sub_total_amount', type: 'any.required' },
    ];

    expect(result).toEqual(expectedErrors);
  });
});
