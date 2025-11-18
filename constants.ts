
import { Invoice } from './types';

export const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'MAD', symbol: 'MAD' },
  { code: 'GBP', symbol: '£' },
];

export const VAT_RATES = [0, 0.1, 0.2];

export const INITIAL_INVOICE_DATA: Invoice = {
  id: `inv_${Date.now()}`,
  invoiceNumber: 'INV-001',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: CURRENCIES[1],
  company: {
    name: 'Your Company',
    logo: null,
    address: '123 Main Street, Anytown, USA 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@yourcompany.com',
    website: 'www.yourcompany.com',
    taxId: 'VAT ID: 123456789',
  },
  client: {
    name: 'Client Name',
    address: '456 Oak Avenue, Sometown, USA 67890',
    email: 'client@email.com',
    phone: '+1 (555) 987-6543',
    clientId: 'CUST-001',
  },
  items: [
    {
      id: `item_${Date.now()}`,
      description: 'Product / Service Description',
      quantity: 1,
      unitPrice: 100,
      vatRate: 0.2,
    },
  ],
  discount: { type: 'percentage', value: 0 },
  deposit: 0,
  notes: 'Thank you for your business.',
  paymentTerms: 'Payment due within 30 days.',
  bankDetails: 'Bank: Global Bank\nIBAN: XX00 0000 0000 0000 0000 000\nBIC: GLOBAXXX',
  lateFeeInfo: 'A late fee of 1.5% will be charged per month on overdue invoices.',
  status: 'draft',
  language: 'fr',
};
   