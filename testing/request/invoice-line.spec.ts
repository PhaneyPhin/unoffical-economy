import { InvoiceLine } from "../../src/interface/invoice";
import { InvoiceLineValidator } from "../../src/requests/invoice.request";

describe('Invoice Line Validator', () => {
    test('Valid Invoice Line', () => {
      const validInvoiceLine = {
        id: '123',
        quantity_unit_code: 'unit',
        quantity: 5,
        line_extension_amount: 100,
        price: 20,
        item: {
          name: 'Product',
          description: 'Product Description',
          tax_categories: [
            {
              id: '456',
              percent: 10,
              tax_scheme: 'VAT',
            },
          ],
        },
      };
  
      const { error, value } = InvoiceLineValidator.validate(validInvoiceLine);
  
      // No error should be present
      expect(error).toBeUndefined();
  
      // The validated value should match the input
      expect(value).toEqual(validInvoiceLine);
    });
  
    test('Invalid Invoice Line', () => {
      const invalidInvoiceLine = {
        // Missing required fields
      };
  
      const { error } = InvoiceLineValidator.validate(invalidInvoiceLine);
  
      // An error should be present
      expect(error).toBeDefined();
    });
  });

  test('Invalid Invoice Line - Invalid line_extension_amount', () => {
    const invalidInvoiceLine: Partial<InvoiceLine> = {
      id: '123',
      quantity_unit_code: 'unit',
      quantity: 5,
      line_extension_amount: 50, // Invalid value, should not match the expected amount
      price: 20,
      item: {
        name: 'Product',
        description: 'Product Description',
        tax_categories: [
          {
            id: '456',
            percent: 10,
            tax_scheme: 'VAT',
          },
        ],
      },
    };

    const { error } = InvoiceLineValidator.validate(invalidInvoiceLine);
    // An error should be present
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('"line_extension_amount" contains an invalid value')
  });

  describe('Invoice Line Validator', () => {
    test('Invalid Invoice Line - Missing Required Fields', () => {
      const invalidInvoiceLine: Partial<InvoiceLine> = {
        // All required fields are missing
      };
  
      const { error } = InvoiceLineValidator.validate(invalidInvoiceLine);
      // An error should be present
      expect(error).toBeDefined();
  
      // You can also check specific details about the error, if needed
      // For example, you might want to verify that specific required fields are mentioned in the error details
      if (error) {
        const { details } = error;
        const requiredFields = ['id', 'quantity_unit_code', 'quantity', 'line_extension_amount', 'price', 'item'];
        
        requiredFields.forEach((field) => {
          expect(details).toContainEqual(expect.objectContaining({ message: `"${field}" is required` }));
        });
      }
    });
  });