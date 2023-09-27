import avro from 'avsc'

export const InvoiceSchemaType = avro.Type.forSchema({
    "type": "record",
    "name": "Invoice",
    "fields": [
      {
        "name": "buyer_name",
        "type": "string"
      },
      {
        "name": "buyer_vat_tin",
        "type": "string"
      },
      {
        "name": "buyer_address",
        "type": "string"
      },
      {
        "name": "buyer_phone",
        "type": "string"
      },
      {
        "name": "invoice_currency",
        "type": "string"
      },
      {
        "name": "seller_name",
        "type": "string"
      },
      {
        "name": "seller_address",
        "type": "string"
      },
      {
        "name": "invoice_items",
        "type": {
          "type": "array",
          "items": {
            "type": "record",
            "name": "InvoiceItem",
            "fields": [
              {
                "name": "item_name",
                "type": "string"
              },
              {
                "name": "item_description",
                "type": "string"
              },
              {
                "name": "item_quantity",
                "type": "double"
              },
              {
                "name": "item_unit_price",
                "type": "double"
              }
            ]
          }
        }
      }
    ]
  });
