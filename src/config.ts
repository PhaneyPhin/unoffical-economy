export const VALIDATE_INVOICE_TOPIC = 'validate-invoice'
export const VALIDATE_INVOICE_REPLY_TOPIC ='validate-invoice.reply'
export const KAFKA_BROKER = 'kafka:9092'
export const CLIENT_ID = 'invoice-validator'
export const CACHE_TTL = 3600
export const LISTEN_TOPIC = [VALIDATE_INVOICE_TOPIC]
export const GROUP_ID =  "invoice-validator";