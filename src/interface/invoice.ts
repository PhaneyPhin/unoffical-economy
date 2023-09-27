export interface Invoice {
    buyer_name: string;
    buyer_vat_tin: string;
    buyer_address: string;
    buyer_phone: string;
    invoice_currency: string;
    seller_name: string;
    seller_address: string;
    invoice_items: InvoiceItem[];
  }
  
export interface InvoiceItem {
    item_name: string;
    item_description: string;
    item_quantity: number;
    item_unit_price: number;
}