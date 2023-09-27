import avro from 'avsc'

export const ResponseSchema = avro.Type.forSchema({
    "type": "record",
    "name": "ValidationErrorWithFlag",
    "fields": [
      {
        "name": "isError",
        "type": "boolean"
      },
      {
        "name": "data",
        "type": {
          "type": "array",
          "items": {
            "type": "record",
            "name": "ValidationError",
            "fields": [
              {
                "name": "message",
                "type": "string"
              },
              {
                "name": "path",
                "type": "string"
              },
              {
                "name": "type",
                "type": "string"
              }
            ]
          }
        }
      }
    ]
  }
)