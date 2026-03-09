import {
    ArrowLeft,
    History,
    FileText,
    Activity,
    Pill,
    User,
    Plus
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Badge, Button } from '../../components/ui';

const PatientDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const patient = {
        id: id || 'PT-001',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        bloodType: 'O+',
        weight: '78kg',
        bloodPressure: '120/80',
        complaint: 'Persistent chest pain and shortness of breath since yesterday.',
        history: [
            { date: '2025-10-12', diagnosis: 'Hypertension', doctor: 'Dr. James Wilson', treatment: 'Amlodipine 5mg' },
            { date: '2024-05-20', diagnosis: 'Mild Gastritis', doctor: 'Dr. Sarah Chen', treatment: 'Antacids' },
        ],
        vitals: [
            { label: 'Heart Rate', value: '72 bpm', trend: 'Normal' },
            { label: 'SpO2', value: '98%', trend: 'Good' },
            { label: 'Temp', value: '98.6°F', trend: 'Normal' },
        ]
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Patient Consultation</h1>
                    <p className="text-sm text-slate-500">Currently examining {patient.name} • {patient.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Case Card */}
                    <Card className="p-8">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                            <Activity className="text-hospital-600" size={20} />
                            Current Presentation
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Chief Complaint</p>
                                <p className="text-slate-800 leading-relaxed font-medium">{patient.complaint}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-700">Clinical Observations</h3>
                                    <textarea
                                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-hospital-500 transition-all"
                                        placeholder="Describe symptoms, signs and findings..."
                                    ></textarea>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-700">Diagnosis / Impression</h3>
                                    <textarea
                                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-hospital-500 transition-all"
                                        placeholder="Enter suspected condition..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="outline" className="gap-2">
                                    <FileText size={18} />
                                    Request Lab Test
                                </Button>
                                <Button className="gap-2">
                                    <Pill size={18} />
                                    Add Prescription
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* History Timeline */}
                    <Card className="p-8">
                        <h2 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                            <History className="text-hospital-600" size={20} />
                            Patient History
                        </h2>
                        <div className="space-y-8 relative before:absolute before:inset-0 before:left-[19px] before:border-l-2 before:border-slate-100">
                            {patient.history.map((item, idx) => (
                                <div key={idx} className="relative pl-12">
                                    <div className="absolute left-0 top-1 w-10 h-10 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center -translate-x-1/2">
                                        <div className="w-2.5 h-2.5 bg-slate-300 rounded-full"></div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-hospital-200 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900">{item.diagnosis}</h4>
                                            <span className="text-xs font-bold text-slate-400">{item.date}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">Treatment: {item.treatment}</p>
                                        <div className="flex items-center gap-2 text-xs text-hospital-600 font-medium">
                                            <User size={12} />
                                            {item.doctor}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Patient Overview</h3>
                        <div className="grid grid-cols-2 gap-y-6">
                            <div>
                                <p className="text-xs text-slate-400">Gender / Age</p>
                                <p className="font-bold text-slate-800">{patient.gender} • {patient.age}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Blood Group</p>
                                <Badge variant="danger" className="mt-1">{patient.bloodType}</Badge>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Weight</p>
                                <p className="font-bold text-slate-800">{patient.weight}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Blood Pressure</p>
                                <p className="font-bold text-emerald-600">{patient.bloodPressure}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                            <h4 className="text-sm font-bold text-slate-700">Vital Signs</h4>
                            <div className="space-y-3">
                                {patient.vitals.map((vital, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                        <span className="text-sm text-slate-600">{vital.label}</span>
                                        <span className="text-sm font-black text-slate-900">{vital.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-hospital-50 border-hospital-100">
                        <h3 className="font-bold text-hospital-800 mb-4 flex items-center gap-2">
                            <Plus size={18} />
                            Quick Prescription
                        </h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Medicine name..."
                                className="w-full px-4 py-2 bg-white border border-hospital-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-hospital-500"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Dosage"
                                    className="w-full px-4 py-2 bg-white border border-hospital-100 rounded-lg text-sm outline-none"
                                />
                                <Button size="sm">Add</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;
