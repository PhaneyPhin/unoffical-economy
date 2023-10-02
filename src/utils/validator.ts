import { InvoiceItem } from "../interface/invoice";

export const validateTotal = (total: number, InvoiceItems: InvoiceItem[]) => {
    return total === InvoiceItems.reduce((total,invoiceItem) => total + invoiceItem.item_unit_price * invoiceItem.item_quantity, 0)
}