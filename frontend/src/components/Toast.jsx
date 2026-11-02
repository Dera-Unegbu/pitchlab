import { Toaster } from 'react-hot-toast';
import { CheckCircle2, Info, XCircle } from 'lucide-react';

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4200,
        className: 'pitchlab-toast',
        success: {
          icon: <CheckCircle2 size={18} className="text-[var(--success)]" />
        },
        error: {
          icon: <XCircle size={18} className="text-[var(--risk)]" />
        },
        blank: {
          icon: <Info size={18} className="text-[var(--primary)]" />
        },
        style: {
          background: '#FFFFFF',
          color: '#151A3D',
          border: '1px solid #DCDFFE',
          borderRadius: '20px',
          boxShadow: '0 24px 80px rgba(21,26,61,0.14)',
          padding: '14px 16px',
          fontFamily: 'var(--font-body)'
        }
      }}
    />
  );
}
