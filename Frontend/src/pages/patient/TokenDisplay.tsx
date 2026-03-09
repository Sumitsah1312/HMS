import {
    Users,
    Smartphone,
    MapPin,
    Activity,
    Clock,
    CheckCircle2,
    Hospital
} from 'lucide-react';
import { useState } from 'react';
import { Card, Badge, Button } from '../../components/ui';

const TokenDisplay = () => {
    const [search, setSearch] = useState('');
    const [tokenStatus, setTokenStatus] = useState<any>(null);

    const handleLookup = () => {
        // Mock lookup
        setTokenStatus({
            token: '#024',
            name: 'Sarah Wilson',
            doctor: 'Dr. James Wilson',
            dept: 'Cardiology',
            position: 5,
            estimatedWait: '45 mins',
            status: 'Waiting'
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-12">
            <div className="max-w-2xl mx-auto w-full px-6 space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-hospital-600 rounded-3xl text-white shadow-2xl shadow-hospital-200">
                        <Hospital size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinic Status</h1>
                    <p className="text-slate-500 text-lg">Track your token and estimated wait time live.</p>
                </div>

                {!tokenStatus ? (
                    <Card className="p-8 shadow-xl border-none">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Lookup by Phone or Token ID</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Enter phone or token..."
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg outline-none focus:ring-4 focus:ring-hospital-100 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleLookup}
                                className="w-full py-5 text-lg rounded-2xl"
                            >
                                Track Live Status
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-6 animate-in zoom-in-95 duration-500">
                        <Card className="p-10 border-none shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                <Activity size={200} />
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <Badge variant="info" className="mb-4 bg-hospital-50 text-hospital-600 py-1.5 px-4 text-sm font-bold border-hospital-100 uppercase tracking-widest">
                                    Active Token
                                </Badge>
                                <h2 className="text-7xl font-black text-slate-900 tracking-tighter mb-4">{tokenStatus.token}</h2>
                                <p className="text-2xl font-bold text-slate-800">{tokenStatus.name}</p>
                                <p className="text-slate-500 mt-2">{tokenStatus.dept} • {tokenStatus.doctor}</p>
                            </div>

                            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-slate-50 pt-12">
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Queue Position</p>
                                    <div className="flex items-center justify-center gap-2 text-hospital-600">
                                        <Users size={20} />
                                        <p className="text-3xl font-black">{tokenStatus.position}</p>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Patients ahead</p>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Wait</p>
                                    <div className="flex items-center justify-center gap-2 text-amber-500">
                                        <Clock size={20} />
                                        <p className="text-3xl font-black">~{tokenStatus.estimatedWait}</p>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Live estimation</p>
                                </div>
                            </div>

                            <div className="mt-12 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-emerald-800">You're in good hands!</p>
                                    <p className="text-xs text-emerald-600">Please stay near the Cardiology wing. Our staff will call you shortly.</p>
                                </div>
                            </div>
                        </Card>

                        <button
                            onClick={() => setTokenStatus(null)}
                            className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                        >
                            ← Search Another Token
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-auto py-12 text-center">
                <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                    <MapPin size={14} />
                    Antigravity General Hospital • Wing A, Floor 2
                </p>
            </div>
        </div>
    );
};

export default TokenDisplay;
