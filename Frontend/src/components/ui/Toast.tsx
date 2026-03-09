import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for transition
        }, 2700);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${type === 'success'
                    ? 'bg-white border-teal-100 text-teal-800'
                    : 'bg-white border-rose-100 text-rose-800'
                }`}>
                <div className={`p-1 rounded-full ${type === 'success' ? 'bg-teal-50' : 'bg-rose-50'}`}>
                    {type === 'success' ? <CheckCircle2 size={16} className="text-teal-600" /> : <AlertCircle size={16} className="text-rose-600" />}
                </div>
                <p className="font-bold text-sm">{message}</p>
                <button onClick={() => setVisible(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors ml-2">
                    <X size={14} className="text-slate-400" />
                </button>
            </div>
        </div>
    );
};
