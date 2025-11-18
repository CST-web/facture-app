
import React, { useCallback } from 'react';
import { Invoice, LineItem } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { CURRENCIES, VAT_RATES } from '../constants';
import { fileToBase64 } from '../lib/utils';
import { Trash2, UploadCloud, X } from 'lucide-react';

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, setInvoice }) => {
  const { t } = useTranslations();

  const handleCompanyChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, company: { ...prev.company, [name]: value } }));
  }, [setInvoice]);

  const handleClientChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, client: { ...prev.client, [name]: value } }));
  }, [setInvoice]);

  const handleInvoiceDetailsChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'currency') {
      const selectedCurrency = CURRENCIES.find(c => c.code === value) || CURRENCIES[0];
      setInvoice(prev => ({ ...prev, currency: selectedCurrency }));
    } else {
      setInvoice(prev => ({ ...prev, [name]: value }));
    }
  }, [setInvoice]);

  const handleItemChange = useCallback((index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...invoice.items];
    const item = { ...newItems[index] };
    if(typeof value === 'string') {
        if(field === 'description') item[field] = value;
    } else {
        if(field !== 'description') item[field] = value;
    }
    newItems[index] = item;
    setInvoice(prev => ({ ...prev, items: newItems }));
  }, [invoice.items, setInvoice]);

  const addItem = useCallback(() => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: `item_${Date.now()}`, description: '', quantity: 1, unitPrice: 0, vatRate: 0.2 }]
    }));
  }, [setInvoice]);
  
  const removeItem = useCallback((index: number) => {
    setInvoice(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  }, [setInvoice]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setInvoice(prev => ({ ...prev, company: { ...prev.company, logo: base64 } }));
    }
  };

  const removeLogo = () => {
    setInvoice(prev => ({ ...prev, company: { ...prev.company, logo: null } }));
  }
  
  const handleDiscountChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, discount: { ...prev.discount, [name]: name === 'value' ? parseFloat(value) || 0 : value } }));
  }, [setInvoice]);

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setInvoice(prev => ({...prev, [name]: parseFloat(value) || 0}))
  }

  return (
    <div className="p-4 md:p-6 space-y-8 bg-gray-50 rounded-lg shadow-inner overflow-y-auto">
      {/* Company Section */}
      <Section title={t('yourCompany')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('companyName')} name="name" value={invoice.company.name} onChange={handleCompanyChange} />
          <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{t('logo')}</label>
              {!invoice.company.logo ? (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">{t('uploadLogo')}</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
              ) : (
                <div className="relative group w-24 h-24">
                  <img src={invoice.company.logo} alt="company logo" className="w-full h-full object-contain rounded-md border p-1" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={removeLogo} className="p-2 text-white bg-red-500 rounded-full hover:bg-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
        <Textarea label={t('address')} name="address" value={invoice.company.address} onChange={handleCompanyChange} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('phone')} name="phone" value={invoice.company.phone} onChange={handleCompanyChange} />
          <Input label={t('email')} type="email" name="email" value={invoice.company.email} onChange={handleCompanyChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('website')} name="website" value={invoice.company.website} onChange={handleCompanyChange} />
          <Input label={t('taxId')} name="taxId" value={invoice.company.taxId} onChange={handleCompanyChange} />
        </div>
      </Section>

      {/* Client Section */}
      <Section title={t('billTo')}>
        <Input label={t('clientName')} name="name" value={invoice.client.name} onChange={handleClientChange} />
        <Textarea label={t('address')} name="address" value={invoice.client.address} onChange={handleClientChange} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('phone')} name="phone" value={invoice.client.phone} onChange={handleClientChange} />
          <Input label={t('email')} type="email" name="email" value={invoice.client.email} onChange={handleClientChange} />
        </div>
         <Input label={t('clientId')} name="clientId" value={invoice.client.clientId} onChange={handleClientChange} />
      </Section>
      
      {/* Invoice Details Section */}
      <Section title={t('invoiceDetails')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('invoiceNumber')} name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInvoiceDetailsChange} />
            <Select label={t('currency')} name="currency" value={invoice.currency.code} onChange={handleInvoiceDetailsChange}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
            </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('issueDate')} type="date" name="issueDate" value={invoice.issueDate} onChange={handleInvoiceDetailsChange} />
            <Input label={t('dueDate')} type="date" name="dueDate" value={invoice.dueDate} onChange={handleInvoiceDetailsChange} />
        </div>
      </Section>

      {/* Items Section */}
      <Section title={t('items')}>
        <div className="space-y-2">
            {invoice.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 p-2 rounded-md bg-white border items-center">
                    <div className="col-span-12 md:col-span-4">
                        <Input placeholder={t('itemDescription')} value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                        <Input type="number" placeholder={t('quantity')} value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                        <Input type="number" placeholder={t('unitPrice')} value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                        <Select value={item.vatRate} onChange={(e) => handleItemChange(index, 'vatRate', parseFloat(e.target.value))}>
                            {VAT_RATES.map(rate => <option key={rate} value={rate}>{(rate * 100).toFixed(0)}%</option>)}
                            <option value="custom">Custom</option>
                        </Select>
                    </div>
                    <div className="col-span-1 flex justify-end">
                       {invoice.items.length > 1 && <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>}
                    </div>
                </div>
            ))}
        </div>
        <button onClick={addItem} className="mt-2 w-full text-blue-600 border-2 border-blue-500 rounded-md py-2 px-4 hover:bg-blue-50 transition">{t('addItem')}</button>
      </Section>

      {/* Totals Section */}
      <Section title={t('totals')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex items-center gap-2">
                <Select name="type" value={invoice.discount.type} onChange={handleDiscountChange}>
                    <option value="percentage">%</option>
                    <option value="fixed">{invoice.currency.symbol}</option>
                </Select>
                <Input label={t('discount')} type="number" name="value" value={invoice.discount.value} onChange={handleDiscountChange} />
             </div>
             <Input label={t('depositPaid')} type="number" name="deposit" value={invoice.deposit} onChange={handleNumericChange} />
          </div>
      </Section>

      {/* Notes & Terms Section */}
      <Section title={t('notesAndTerms')}>
        <Textarea label={t('notes')} name="notes" value={invoice.notes} onChange={(e) => setInvoice(prev => ({...prev, notes: e.target.value}))} />
        <Textarea label={t('paymentTerms')} name="paymentTerms" value={invoice.paymentTerms} onChange={(e) => setInvoice(prev => ({...prev, paymentTerms: e.target.value}))} />
        <Textarea label={t('bankDetails')} name="bankDetails" value={invoice.bankDetails} onChange={(e) => setInvoice(prev => ({...prev, bankDetails: e.target.value}))} />
        <Textarea label={t('lateFeeInfo')} name="lateFeeInfo" value={invoice.lateFeeInfo} onChange={(e) => setInvoice(prev => ({...prev, lateFeeInfo: e.target.value}))} />
      </Section>
    </div>
  );
};

// Helper components for form fields
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{title}</h3>
    <div className="space-y-4 pt-2">{children}</div>
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      {...props}
    />
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
const Textarea: React.FC<TextareaProps> = ({ label, ...props }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <textarea
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            {...props}
        />
    </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}
const Select: React.FC<SelectProps> = ({ label, children, ...props }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <select
            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            {...props}
        >
            {children}
        </select>
    </div>
);
   