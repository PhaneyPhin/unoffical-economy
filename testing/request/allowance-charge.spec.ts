import { AllowanceChargeValidator } from "../../src/requests/invoice.request";

describe('AllowanceChargeValidator', () => {
    test('Valid AllowanceCharge', () => {
      const validAllowanceCharge = {
        charge_indicator: true,
        reason: 'Discount',
        amount: 10,
        tax_categories: [
          {
            id: '123',
            percent: 5,
            tax_scheme: 'VAT',
          },
        ],
      };
  
      const { error, value } = AllowanceChargeValidator.validate(validAllowanceCharge);
  
      // No error should be present
      expect(error).toBeUndefined();
  
      // The validated value should match the input
      expect(value).toEqual(validAllowanceCharge);
    });
  
    test('Invalid AllowanceCharge - Missing Required Field (amount)', () => {
      const invalidAllowanceCharge = {
        // Missing required field "amount"
        charge_indicator: true,
        reason: 'Discount',
        tax_categories: [
          {
            id: '123',
            percent: 5,
            tax_scheme: 'VAT',
          },
        ],
      };
  
      const { error } = AllowanceChargeValidator.validate(invalidAllowanceCharge);
  
      // An error should be present
      expect(error).toBeDefined();
  
      // The error should mention the missing required field "amount"
      if (error) {
        const { details } = error;
        expect(details).toContainEqual(expect.objectContaining({ message: '"amount" is required' }));
      }
    });
  });