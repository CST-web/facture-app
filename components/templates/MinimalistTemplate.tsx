import React from 'react';
import { Invoice } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';
import { formatDate, formatCurrency } from '../../lib/utils';

interface TemplateProps {
  invoice: Invoice;
  color: string;
}

export const MinimalistTemplate: React.FC<TemplateProps> = ({ invoice, color }) => {
  const { t, language, direction } = useTranslations();

  const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const discountAmount = invoice.discount.type === 'fixed' 
    ? invoice.discount.value 
    : subtotal * (invoice.discount.value / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  
  // FIX: Explicitly type the accumulator `acc` to ensure correct type inference for `vatTotals`.
  // This resolves issues where `vatTotals` values were inferred as `unknown`, causing cascading type errors.
  const vatTotals = invoice.items.reduce((acc: { [key: number]: number }, item) => {
    const itemTotal = item.quantity * item.unitPrice;
    const vatAmount = itemTotal * item.vatRate;
    acc[item.vatRate] = (acc[item.vatRate] || 0) + vatAmount;
    return acc;
  }, {} as { [key: number]: number });

  const totalVat = Object.values(vatTotals).reduce((sum, amount) => sum + amount, 0);
  const total = subtotalAfterDiscount + totalVat;
  const balanceDue = total - invoice.deposit;

  const textColor = `text-[${color}]`;
  const bgColor = `bg-[${color}]`;

  return (
    <div className={`p-10 text-sm text-gray-800 bg-white h-full ${language === 'ar' ? 'font-cairo' : 'font-sans'}`} dir={direction}>
      <div className="flex justify-between items-start">
        <div>
          {invoice.company.logo && <img src={invoice.company.logo} alt="Company Logo" className="h-16 w-auto mb-4" />}
          <h1 className="text-xl font-bold text-gray-900">{invoice.company.name}</h1>
          <p className="whitespace-pre-line">{invoice.company.address}</p>
          <p>{invoice.company.phone}</p>
          <p>{invoice.company.email}</p>
          <p>{invoice.company.website}</p>
          <p>{invoice.company.taxId}</p>
        </div>
        <div className="text-right rtl:text-left">
          <h2 className="text-3xl font-bold" style={{color: color}}>{t('invoice')}</h2>
          <p className="mt-2 text-gray-500">{t('invoiceNumber')} <span className="text-gray-900">{invoice.invoiceNumber}</span></p>
          <p className="text-gray-500">{t('issueDate')}: <span className="text-gray-900">{formatDate(invoice.issueDate, language)}</span></p>
          <p className="text-gray-500">{t('dueDate')}: <span className="text-gray-900">{formatDate(invoice.dueDate, language)}</span></p>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-semibold text-gray-500">{t('billTo')}</h3>
        <p className="font-bold text-gray-900">{invoice.client.name}</p>
        <p className="whitespace-pre-line">{invoice.client.address}</p>
        <p>{invoice.client.phone}</p>
        <p>{invoice.client.email}</p>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="border-b-2" style={{borderColor: color}}>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left rtl:text-right text-sm font-semibold text-gray-900 sm:pl-0">{t('itemDescription')}</th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">{t('quantity')}</th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">{t('unitPrice')}</th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">{t('vatRate')}</th>
                  <th scope="col" className="py-3.5 pl-3 pr-4 text-right rtl:text-left text-sm font-semibold text-gray-900 sm:pr-0">{t('amount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map(item => (
                  <tr key={item.id}>
                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                      {item.description}
                    </td>
                    <td className="px-3 py-4 text-sm text-center text-gray-500">{item.quantity}</td>
                    <td className="px-3 py-4 text-sm text-center text-gray-500">{formatCurrency(item.unitPrice, invoice.currency.code, language)}</td>
                    <td className="px-3 py-4 text-sm text-center text-gray-500">{(item.vatRate * 100).toFixed(0)}%</td>
                    <td className="py-4 pl-3 pr-4 text-sm font-medium text-right rtl:text-left text-gray-900 sm:pr-0">{formatCurrency(item.quantity * item.unitPrice, invoice.currency.code, language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end rtl:justify-start">
        <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between">
                <span className="text-gray-500">{t('subtotal')}</span>
                <span>{formatCurrency(subtotal, invoice.currency.code, language)}</span>
            </div>
            {discountAmount > 0 && <div className="flex justify-between">
                <span className="text-gray-500">{t('discount')} ({invoice.discount.type === 'percentage' ? `${invoice.discount.value}%` : formatCurrency(invoice.discount.value, invoice.currency.code, language)})</span>
                <span>- {formatCurrency(discountAmount, invoice.currency.code, language)}</span>
            </div>}
            
            {Object.entries(vatTotals).map(([rate, amount]) => (
                <div key={rate} className="flex justify-between">
                    <span className="text-gray-500">{t('vat')} ({(parseFloat(rate) * 100).toFixed(0)}%)</span>
                    <span>{formatCurrency(amount, invoice.currency.code, language)}</span>
                </div>
            ))}
            
            <div className="border-t pt-2 mt-2"></div>
            <div className="flex justify-between font-bold text-lg" style={{color: color}}>
                <span>{t('total')}</span>
                <span>{formatCurrency(total, invoice.currency.code, language)}</span>
            </div>
            {invoice.deposit > 0 && <div className="flex justify-between">
                <span className="text-gray-500">{t('depositPaid')}</span>
                <span>- {formatCurrency(invoice.deposit, invoice.currency.code, language)}</span>
            </div>}
            <div className="flex justify-between font-bold p-2 rounded-md" style={{backgroundColor: `${color}20`}}>
                <span style={{color: color}}>{t('balanceDue')}</span>
                <span style={{color: color}}>{formatCurrency(balanceDue, invoice.currency.code, language)}</span>
            </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t">
        {invoice.notes && (
          <div>
            <h4 className="font-semibold text-gray-900">{t('notes')}</h4>
            <p className="text-gray-500 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
        {invoice.paymentTerms && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900">{t('paymentTerms')}</h4>
            <p className="text-gray-500 whitespace-pre-line">{invoice.paymentTerms}</p>
          </div>
        )}
      </div>

       <div className="absolute bottom-5 left-0 right-0 px-10 text-xs text-gray-400 text-center">
            <p className="whitespace-pre-line">{invoice.bankDetails}</p>
            <p className="mt-1">{invoice.lateFeeInfo}</p>
       </div>
    </div>
  );
};