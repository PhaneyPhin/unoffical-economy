import { simplifyErrors } from '../../src/utils/simplifyError'; // Replace with the actual path
import { describe, test, expect } from '@jest/globals';

describe('simplifyErrors', () => {
  test('Simplify Valid Error Details', () => {
    // Simulate valid error details from Joi
    const originalData = {
      details: [
        {
          message: '"buyer_name" is required',
          path: ['buyer_name'],
          type: 'any.required',
        },
        {
          message: '"buyer_vat_tin" must be a string',
          path: ['buyer_vat_tin'],
          type: 'string.base',
        },
      ],
    };

    const simplifiedErrors = simplifyErrors(originalData);

    // Verify that the simplified errors match the expected format
    expect(simplifiedErrors).toEqual([
      {
        message: '"buyer_name" is required',
        path: 'buyer_name',
        type: 'any.required',
      },
      {
        message: '"buyer_vat_tin" must be a string',
        path: 'buyer_vat_tin',
        type: 'string.base',
      },
    ]);
  });

  test('Empty Error Details', () => {
    const originalData = {
      details: [],
    };

    const simplifiedErrors = simplifyErrors(originalData);

    expect(simplifiedErrors).toEqual([]);
  });

  test('Invalid Error Details Format', () => {
    // Simulate invalid error details format (not an array)
    const originalData = {
      details: 'invalidData',
    };

    const simplifiedErrors = simplifyErrors(originalData);

    // Verify that no errors are returned
    expect(simplifiedErrors).toEqual([]);
  });

  // Add more test cases for other scenarios...
});