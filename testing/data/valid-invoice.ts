import { AVAILABLE_CURRENCY } from "../../src/config";

export const validInvoiceData = {
    due_date: '2023-12-31',
    buyer_reference: 'BR123',
    buyer_vat_tin: '123456789',
    invoice_id: 'INV-234533222',
    currency: AVAILABLE_CURRENCY[0],
    allowance_charges: [
      {
        charge_indicator: true,
        reason: 'Discount',
        amount: 5,
        tax_categories: [
          {
            id: '456',
            percent: 10,
            tax_scheme: 'VAT',
          },
        ],
      },
    ],
    exchange_rate: 1.2,
    invoice_lines: [
      {
        id: '789',
        quantity_unit_code: 'unit',
        quantity: 10,
        line_extension_amount: 100,
        price: 10,
        item: {
          name: 'Product',
          description: 'Product Description',
          tax_categories: [
            {
              id: '123',
              percent: 5,
              tax_scheme: 'VAT',
            },
          ],
        },
      },
    ],
    sub_total: 105, // Calculated based on invoice_lines and allowance_charges
  };
  