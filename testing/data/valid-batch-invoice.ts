export const validBatchInvoice: any = {
  buyer_vat_tin: '123456789',
  customer: {
    business_single_id: "123456789",
    business_name_en: "Example Business (English)",
    business_name_km: "អាវិតាសហរណ៍ (ខ្មែរ)",
    "business_vat_tin": "1234-058991820",
    "invoice_webhook": "https://example.com/webhook",
    "city_name": "Phnom Penh",
    "postal_zone": "12100",
    "country_code": "KH",
    "tax_scheme": "VAT",
    "contact_name": "John Doe",
    "contact_phone": "0123456789",
    "contact_email": "john@example.com"
  },
  invoices: [
    {
      due_date: '2023-12-31',
      buyer_reference: 'BR123',

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
    }
  ]
};
