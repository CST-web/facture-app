
import { Language } from '../types';

type Translation = {
  [key: string]: { [lang in Language]: string };
};

export const translations: Translation = {
  // App Title
  appTitle: { fr: "FacturePro Multilingue", en: "Multilingual InvoicePro", ar: "فاتورة برو متعدد اللغات" },

  // Sections
  yourCompany: { fr: "Votre Entreprise", en: "Your Company", ar: "شركتك" },
  billTo: { fr: "Client", en: "Bill To", ar: "فاتورة إلى" },
  invoiceDetails: { fr: "Détails de la Facture", en: "Invoice Details", ar: "تفاصيل الفاتورة" },
  items: { fr: "Produits / Services", en: "Items", ar: "البنود" },
  totals: { fr: "Totaux", en: "Totals", ar: "المجاميع" },
  notesAndTerms: { fr: "Notes & Conditions", en: "Notes & Terms", ar: "ملاحظات وشروط" },

  // Form Fields & Labels
  companyName: { fr: "Nom de l'entreprise", en: "Company Name", ar: "اسم الشركة" },
  logo: { fr: "Logo", en: "Logo", ar: "الشعار" },
  uploadLogo: { fr: "Charger un logo", en: "Upload Logo", ar: "تحميل الشعار" },
  changeLogo: { fr: "Changer", en: "Change", ar: "تغيير" },
  removeLogo: { fr: "Supprimer", en: "Remove", ar: "إزالة" },
  address: { fr: "Adresse", en: "Address", ar: "العنوان" },
  phone: { fr: "Téléphone", en: "Phone", ar: "الهاتف" },
  email: { fr: "Email", en: "Email", ar: "البريد الإلكتروني" },
  website: { fr: "Site Web", en: "Website", ar: "الموقع الإلكتروني" },
  taxId: { fr: "N° SIRET/TVA", en: "Tax ID", ar: "الرقم الضريبي" },
  clientName: { fr: "Nom du client", en: "Client Name", ar: "اسم العميل" },
  clientId: { fr: "N° Client", en: "Client ID", ar: "معرف العميل" },
  invoiceNumber: { fr: "N° de Facture", en: "Invoice #", ar: "رقم الفاتورة" },
  issueDate: { fr: "Date d'émission", en: "Issue Date", ar: "تاريخ الإصدار" },
  dueDate: { fr: "Date d'échéance", en: "Due Date", ar: "تاريخ الاستحقاق" },
  currency: { fr: "Devise", en: "Currency", ar: "العملة" },
  
  // Line Items Table
  itemDescription: { fr: "Description", en: "Description", ar: "الوصف" },
  quantity: { fr: "Qté", en: "Qty", ar: "الكمية" },
  unitPrice: { fr: "Prix Unitaire", en: "Unit Price", ar: "سعر الوحدة" },
  vatRate: { fr: "TVA (%)", en: "VAT (%)", ar: "ض.ق.م (%)" },
  amount: { fr: "Montant", en: "Amount", ar: "المبلغ" },
  addItem: { fr: "Ajouter une ligne", en: "Add Item", ar: "إضافة بند" },

  // Totals Section
  subtotal: { fr: "Sous-total HT", en: "Subtotal", ar: "المجموع الفرعي" },
  discount: { fr: "Remise", en: "Discount", ar: "الخصم" },
  vat: { fr: "TVA", en: "VAT", ar: "ض.ق.م" },
  total: { fr: "Total TTC", en: "Total", ar: "المجموع الكلي" },
  depositPaid: { fr: "Acompte versé", en: "Deposit Paid", ar: "عربون مدفوع" },
  balanceDue: { fr: "Solde à payer", en: "Balance Due", ar: "الرصيد المستحق" },

  // Notes Section
  notes: { fr: "Notes", en: "Notes", ar: "ملاحظات" },
  paymentTerms: { fr: "Conditions de paiement", en: "Payment Terms", ar: "شروط الدفع" },
  bankDetails: { fr: "Informations bancaires", en: "Bank Details", ar: "تفاصيل البنك" },
  lateFeeInfo: { fr: "Pénalités de retard", en: "Late Fee Info", ar: "معلومات غرامة التأخير" },

  // Buttons & Actions
  preview: { fr: "Prévisualisation", en: "Preview", ar: "معاينة" },
  downloadPDF: { fr: "Télécharger en PDF", en: "Download PDF", ar: "تحميل PDF" },
  print: { fr: "Imprimer", en: "Print", ar: "طباعة" },
  
  // Invoice Preview Labels (These will be on the generated invoice)
  invoice: { fr: "FACTURE", en: "INVOICE", ar: "فاتورة" },
  invoiceTo: { fr: "FACTURE À", en: "INVOICE TO", ar: "فاتورة إلى" },
  from: { fr: "DE", en: "FROM", ar: "من" },
};
   