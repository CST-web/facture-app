
import { Language } from '../types';

export const formatDate = (dateString: string, lang: Language): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  switch (lang) {
    case 'en':
      // While en-US is MM/DD/YYYY, en-GB is DD/MM/YYYY. We'll use a common international format.
      return date.toLocaleDateString('en-CA', options); // YYYY-MM-DD which is unambiguous
    case 'fr':
      return date.toLocaleDateString('fr-FR', options); // DD/MM/YYYY
    case 'ar':
       // Using 'ar-MA' for Moroccan Arabic which uses DD/MM/YYYY format
      return date.toLocaleDateString('ar-MA', options);
    default:
      return date.toLocaleDateString();
  }
};

export const formatCurrency = (amount: number, currencyCode: string, lang: Language): string => {
  const locale = lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported currency codes
    console.warn(`Currency formatting failed for ${currencyCode}. Using fallback.`);
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
   