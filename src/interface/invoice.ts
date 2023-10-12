interface TaxCategory {
  id: string | null;
  percent: number;
  tax_scheme: string | null;
}

export interface Item {
  description: string | null;
  name: string | null;
  tax_categories: TaxCategory[] | null;
}

export interface AllowanceCharge {
  charge_indicator: boolean | null;
  reason: string | null;
  amount: number;
  tax_categories: TaxCategory[] | null;
}

export interface InvoiceLine {
  id: string | null;
  quantity_unit_code: string | null;
  quantity: number;
  line_extension_amount: number;
  price: number;
  item: Item | null;
}

export interface LegalMonetaryTotal {
  line_extension_amount: number;
  tax_exclusive_amount: number;
  tax_inclusive_amount: number;
  charge_total_amount: number;
  payable_amount: number;
}

export interface Merchant {
  id: number;
  business_single_id: string;
  business_name_en: string;
  business_name_km: string;
  business_vat_tin: string;
  invoice_webhook: string;
}


export interface Invoice {
  due_date: string | null;
  buyer_reference: string | null;
  buyer_vat_tin: string | null;
  allowance_charges: AllowanceCharge[] | null;
  exchange_rate: number;
  invoice_lines: InvoiceLine[] | null;
  supplier: Merchant | null;
  customer: Merchant | null;
  legal_monetary_total: LegalMonetaryTotal | null;
}

export interface ProcessInvoiceData {
  process_id: number,
  invoice: Invoice
}

export interface BatchInvoiceData {
  buyer: Merchant,
  seller: Merchant,
  invoices: Invoice[]
}
export interface ProcessBatchInvoiceData {
  process_id: number,
  data: BatchInvoiceData,
}