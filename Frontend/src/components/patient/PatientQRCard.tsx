import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Printer, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui';

interface PatientQRCardProps {
    patient: {
        id: string;
        name: string;
        token: string;
        department: string;
        doctor: string;
    };
}

const PatientQRCard: React.FC<PatientQRCardProps> = ({ patient }) => {
    const qrData = JSON.stringify({
        id: patient.id,
        token: patient.token,
        type: 'HMS_PATIENT_SESSION'
    });

    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium max-w-sm mx-auto border border-slate-100 animate-slide-up">
            {/* Header */}
            <div className="bg-brand-600 p-8 text-white text-center relative">
                <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <CheckCircle2 size={20} />
                </div>
                <h3 className="font-display font-black text-2xl tracking-tight mb-1">Session Token</h3>
                <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em]">Patient Assigned Successfully</p>
            </div>

            {/* QR Code Section */}
            <div className="p-10 flex flex-col items-center gap-8">
                <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <QRCodeSVG
                        value={qrData}
                        size={180}
                        level="H"
                        includeMargin={false}
                    />
                </div>

                <div className="text-center space-y-2">
                    <p className="text-[10px] font-black uppercase text-clinical-slate tracking-widest">Digital Token ID</p>
                    <p className="text-3xl font-display font-black text-clinical-text tracking-tighter">#{patient.token}</p>
                </div>

                {/* Patient Details */}
                <div className="w-full grid grid-cols-2 gap-4 py-6 border-t border-slate-100">
                    <div>
                        <p className="text-[10px] font-black uppercase text-clinical-slate tracking-widest mb-1">Patient</p>
                        <p className="text-sm font-bold text-clinical-text truncate">{patient.name}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-clinical-slate tracking-widest mb-1">Medical ID</p>
                        <p className="text-sm font-bold text-clinical-text">MRN-{patient.id}</p>
                    </div>
                    <div className="col-span-2 mt-2">
                        <p className="text-[10px] font-black uppercase text-clinical-slate tracking-widest mb-1">Consulting Wing</p>
                        <p className="text-sm font-bold text-brand-600">{patient.department} - {patient.doctor}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3 w-full">
                    <Button variant="outline" className="h-12 rounded-2xl">
                        <Printer size={18} />
                    </Button>
                    <Button variant="outline" className="h-12 rounded-2xl">
                        <Download size={18} />
                    </Button>
                    <Button className="h-12 rounded-2xl col-span-1">
                        <Share2 size={18} />
                    </Button>
                </div>
            </div>

            <div className="bg-slate-50 p-4 text-center">
                <p className="text-[10px] font-bold text-clinical-slate italic">Scan this code at the clinic counter or terminal</p>
            </div>
        </div>
    );
};

export default PatientQRCard;
