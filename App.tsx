
import React, { useState, useEffect } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { TranslationsProvider, useTranslations } from './hooks/useTranslations';
import { INITIAL_INVOICE_DATA } from './constants';
import { Invoice, Template } from './types';

const AppContent: React.FC = () => {
    const [invoice, setInvoice] = useState<Invoice>(() => {
        const savedInvoice = localStorage.getItem('invoice_data');
        return savedInvoice ? JSON.parse(savedInvoice) : INITIAL_INVOICE_DATA;
    });
    
    const [template, setTemplate] = useState<Template>('minimalist');
    const [color, setColor] = useState<string>('#3b82f6'); // Default to blue-500

    const { t, language } = useTranslations();

    useEffect(() => {
        localStorage.setItem('invoice_data', JSON.stringify(invoice));
    }, [invoice]);
    
    useEffect(() => {
        setInvoice(prev => ({ ...prev, language: language }));
    }, [language]);


    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-gray-800">{t('appTitle')}</h1>
                <div className="flex items-center gap-4">
                  <input 
                    type="color" 
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 p-1 bg-white border rounded-md cursor-pointer"
                    title="Change template color"
                  />
                  <LanguageSwitcher />
                </div>
            </header>
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-72px)]">
                <div className="overflow-y-auto">
                    <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
                </div>
                <div className="hidden lg:block bg-gray-700 overflow-y-auto">
                    <InvoicePreview invoice={invoice} template={template} color={color} />
                </div>
            </main>
        </div>
    );
}

const App: React.FC = () => {
  return (
    <TranslationsProvider>
      <AppContent />
    </TranslationsProvider>
  );
};

export default App;
   