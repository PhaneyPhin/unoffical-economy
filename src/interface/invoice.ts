export interface Invoice {
    invoice_id: string,
    buyer_vat_tin: string;
    invoice_currency: string;
    sub_total_amount: number;
    invoice_items: InvoiceItem[];
  }
  
export interface InvoiceItem {
    item_name: string;
    item_description: string;
    item_quantity: number;
    item_unit_price: number;
}