export interface Invoice {
  invoice_id: string;
  buyer_name?: string;
  buyer_vat_tin?: string;
  buyer_address?: string;
  buyer_phone?: string;
  invoice_currency?: string;
  invoice_items: InvoiceItem[];
  sub_total_amount: number;
  sender: Merchant;
  buyer?: Merchant | null;
  process_id: number;
}

export interface InvoiceItem {
  item_name: string;
  item_description?: string;
  item_quantity: number;
  item_unit_price: number;
}


export interface Merchant {
  id: number;
  business_single_id: string;
  business_name_en: string;
  business_name_km: string;
  business_vat_tin: string;
  invoice_webhook: string;
}

export interface ProcessInvoiceData {
  process_id: number,
  data: Invoice
}