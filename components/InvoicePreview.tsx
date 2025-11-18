
import React, { useRef } from 'react';
import { Invoice, Template } from '../types';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { useTranslations } from '../hooks/useTranslations';
import { Download, Printer } from 'lucide-react';

interface InvoicePreviewProps {
  invoice: Invoice;
  template: Template;
  color: string;
}

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, template, color }) => {
  const { t } = useTranslations();
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const input = previewRef.current;
    if (!input) return;

    const { jsPDF } = window.jspdf;
    
    window.html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
        putOnlyUsedFonts:true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / pdfWidth;
      const finalHeight = canvasHeight / ratio;

      if(finalHeight > pdfHeight){
        console.warn("Content exceeds A4 page height, may be cut off.")
      }
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
    });
  };

  const handlePrint = () => {
    const printContent = previewRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Invoice</title>');
      // We need to copy styles for printing to work correctly
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('');
          } catch (e) {
            console.warn('Cannot access stylesheet:', styleSheet.href);
            return '';
          }
        })
        .join('\n');
      
      const tailwind = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
      
      printWindow.document.write(`<script src="https://cdn.tailwindcss.com"></script>`);
      printWindow.document.write(`<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">`);
      printWindow.document.write(`<style> body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; font-family: 'Inter', sans-serif; } .font-cairo { font-family: 'Cairo', sans-serif; } </style>`);
      printWindow.document.write('</head><body>');
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };


  const renderTemplate = () => {
    switch (template) {
      case 'minimalist':
        return <MinimalistTemplate invoice={invoice} color={color} />;
      // Add other templates here
      default:
        return <MinimalistTemplate invoice={invoice} color={color} />;
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-200 h-full flex flex-col">
      <div className="flex-shrink-0 mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-700">{t('preview')}</h2>
        <div className="flex items-center gap-2">
            <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow"
            >
                <Download size={16} />
                <span className="hidden sm:inline">{t('downloadPDF')}</span>
            </button>
            <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow"
            >
                <Printer size={16} />
                <span className="hidden sm:inline">{t('print')}</span>
            </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto p-2 bg-white shadow-lg rounded-md">
        <div ref={previewRef} className="A4-aspect-ratio w-full origin-top">
          {renderTemplate()}
        </div>
      </div>
       <style jsx="true">{`
        .A4-aspect-ratio {
            background: white;
            box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
            /* A4 paper size: 21cm x 29.7cm */
            aspect-ratio: 210 / 297; 
            max-width: 800px;
            margin: 0 auto;
        }
        @media print {
            body * {
                visibility: hidden;
            }
            .printable, .printable * {
                visibility: visible;
            }
            .printable {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
        }
       `}</style>
    </div>
  );
};
   