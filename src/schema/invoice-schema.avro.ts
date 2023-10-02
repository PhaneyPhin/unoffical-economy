import avro from 'avsc'

export const InvoiceSchemaType = avro.Type.forSchema({
  "type": "record",
  "name": "InvoiceRecord",
  "fields": [
    {"name": "process_id", "type": "double"},
    {
      "name": "data",
      "type": {
        "type": "record",
        "name": "InvoiceData",
        "fields": [
          {"name": "invoice_id", "type": "int"},
          {"name": "buyer_name", "type": "string"},
          {"name": "buyer_vat_tin", "type": "string"},
          {"name": "buyer_address", "type": "string"},
          {"name": "buyer_phone", "type": "string"},
          {"name": "invoice_currency", "type": "string"},
          {"name": "seller_name", "type": "string"},
          {"name": "seller_address", "type": "string"},
          {
            "name": "invoice_items",
            "type": {
              "type": "array",
              "items": {
                "type": "record",
                "name": "InvoiceItem",
                "fields": [
                  {"name": "item_name", "type": "string"},
                  {"name": "item_description", "type": "string"},
                  {"name": "item_quantity", "type": "int"},
                  {"name": "item_unit_price", "type": "int"}
                ]
              }
            }
          },
          {"name": "sub_total_amount", "type": "string"}
        ]
      }
    }
  ]
});
