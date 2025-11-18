
export type Language = 'en' | 'fr' | 'ar';
export type Direction = 'ltr' | 'rtl';
export type Template = 'minimalist' | 'corporate' | 'creative';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export interface Company {
  name: string;
  logo: string | null;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

export interface Client {
  name: string;
  address: string;
  email: string;
  phone: string;
  clientId: string;
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: { code: string; symbol: string };
  company: Company;
  client: Client;
  items: LineItem[];
  discount: Discount;
  deposit: number;
  notes: string;
  paymentTerms: string;
  bankDetails: string;
  lateFeeInfo: string;
  status: InvoiceStatus;
  language: Language;
}
   