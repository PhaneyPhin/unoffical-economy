enum Topic {
    PROCESS_INVOICE = 'process-invoice',
    PROCESS_INVOICE_REPLY = 'process-invoice.reply',
    PROCESS_BATCH_INVOICE = 'process-batch-invoice',
    PROCESS_BATCH_INVOICE_REPLY = 'process-batch-invoice.replay',
}

export const LISTEN_TOPIC = [
    Topic.PROCESS_INVOICE,
    Topic.PROCESS_BATCH_INVOICE
]

export default Topic